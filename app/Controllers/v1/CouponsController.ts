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

    const result = await this.dynamicService.create('Coupon', payload);

    await utils.createAudity('CREATE', 'COUPON', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateCouponValidator);

    const oldData = await this.dynamicService.getById('Coupon', payload.id);

    if (payload.uses === payload.max_uses) {
      const status = await this.statusService.searchStatusByName('Esgotado', 'coupon');

      if (status) {
        payload.status_id = status.id;
      }
    }

    const result = await this.dynamicService.update('Coupon', payload);

    await utils.createAudity(
      'UPDATE',
      'COUPON',
      result.id,
      context.auth.user?.$attributes.id,
      oldData.$attributes,
      result
    );

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.search('Coupon', payload);

    const resultByRole = await utils.getInfosByRole(context.auth.user!.id, result, 'Coupon');

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', resultByRole);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('Coupon', id);

    const result = await this.dynamicService.softDelete('Coupon', { id });

    await utils.createAudity('DELETE', 'COUPON', id, context.auth.user?.$attributes.id, oldData.$attributes, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('DELETE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
