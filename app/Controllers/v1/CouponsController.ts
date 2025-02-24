import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateCouponValidator, UpdateCouponValidator } from 'App/Validators/v1/CouponsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import StatusService from 'App/Services/v1/StatusService';
import utils from 'Utils/utils';

export default class CouponsController {
  private dynamicService: DynamicService = new DynamicService();
  private statusService: StatusService = new StatusService();

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

    const result = await this.dynamicService.searchActives('Coupon', query);

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
