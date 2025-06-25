import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateCouponValidator, UpdateCouponValidator, ValidateCouponValidator } from 'App/Validators/v1/CouponsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import StatusService from 'App/Services/v1/StatusService';
import utils from 'Utils/utils';
import { DateTime } from 'luxon';
import Coupons from 'App/Models/Access/Coupons';

export default class CouponsController {
  private dynamicService: DynamicService = new DynamicService();
  private statusService: StatusService = new StatusService();

  public async validateCoupon(context: HttpContextContract) {
    try {
      // Validar a requisição
      const payload = await context.request.validate(ValidateCouponValidator);
      
      // Buscar o cupom
      const coupon = await Coupons.query()
        .where('event_id', payload.event_id)
        .where('code', payload.code.toUpperCase())
        .whereNull('deleted_at')
        .preload('status')
        .first();

      if (!coupon) {
        return utils.handleError(context, 404, 'COUPON_NOT_FOUND', 'Cupom não encontrado para este evento');
      }

      // Verificar se o status do cupom é ativo
      if (coupon.status.name !== 'Disponível') {
        return context.response.status(200).json({
          valid: false,
          reason: 'COUPON_INACTIVE',
          message: 'Cupom não está ativo'
        });
      }

      // Verificar se ainda não atingiu o limite de usos
      if (coupon.uses >= coupon.max_uses) {
        return context.response.status(200).json({
          valid: false,
          reason: 'COUPON_EXHAUSTED',
          message: 'Cupom esgotado'
        });
      }

      // Verificar se está dentro do período de validade
      const now = DateTime.now();
      
      if (coupon.start_date && now < coupon.start_date) {
        return context.response.status(200).json({
          valid: false,
          reason: 'COUPON_NOT_STARTED',
          message: 'Cupom ainda não está válido'
        });
      }

      if (coupon.end_date && now > coupon.end_date) {
        return context.response.status(200).json({
          valid: false,
          reason: 'COUPON_EXPIRED',
          message: 'Cupom expirado'
        });
      }

      // Cupom válido
      return context.response.status(200).json({
        valid: true,
        discountType: coupon.discount_type.toLowerCase(),
        discountValue: coupon.discount_value,
        remainingUses: coupon.max_uses - coupon.uses
      });

    } catch (error) {
      // Log do erro para monitoramento
      console.error('Erro na validação do cupom:', error);
      
      return utils.handleError(context, 500, 'VALIDATION_ERROR', 'Erro interno do servidor');
    }
  }

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateCouponValidator);

    const ableToCreate = await utils.checkHasEventPermission(context.auth.user!.id, payload.data[0].event_id);

    if (!ableToCreate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'Acesso negado');
    }

    const result = await this.dynamicService.bulkCreate({
      modelName: 'Coupon',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'CREATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateCouponValidator);

    const coupon = await this.dynamicService.getById('Coupon', payload.data[0].id);

    const ableToUpdate = await utils.checkHasEventPermission(context.auth.user!.id, coupon.event_id);

    if (!ableToUpdate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'Acesso negado');
    }

    const updatedRecords = await Promise.all(
      payload.data.map(async (item) => {
        if (item.uses === item.max_uses) {
          const status = await this.statusService.searchStatusByName('Esgotado', 'coupon');

          if (status) {
            item.status_id = status.id;
          }
        }

        return item;
      })
    );

    const result = await this.dynamicService.bulkUpdate({
      modelName: 'Coupon',
      records: updatedRecords,
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'UPDATE_SUCCESS', 200);
  }

  public async search(context: HttpContextContract) {
    const query = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.search('Coupon', query);

    const resultByRole = await utils.getInfosByRole(context.auth.user!.id, result, 'Coupon');

    return utils.handleSuccess(context, resultByRole, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const coupon = await this.dynamicService.getById('Coupon', id);

    const ableToDelete = await utils.checkHasEventPermission(context.auth.user!.id, coupon.event_id);

    if (!ableToDelete) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'Acesso negado');
    }

    const result = await this.dynamicService.softDelete({
      modelName: 'Coupon',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }
}
