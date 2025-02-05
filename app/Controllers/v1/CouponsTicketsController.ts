import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateCouponTicketValidator } from 'App/Validators/v1/CouponsTicketsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class CouponsTicketsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateCouponTicketValidator);

    const result = await this.dynamicService.create('CouponsTickets', payload);

    await utils.createAudity('CREATE', 'COUPONS_TICKETS', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 201, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.searchActives('CouponsTickets', payload);

    const resultByRole = await utils.getInfosByRole(context.auth.user!.id, result, 'CouponsTickets');

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', resultByRole);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('CouponsTickets', id);

    const result = await this.dynamicService.softDelete('CouponsTickets', { id });

    await utils.createAudity(
      'DELETE',
      'COUPONS_TICKETS',
      id,
      context.auth.user?.$attributes.id,
      oldData.$attributes,
      result
    );

    const headers = utils.getHeaders();

    const body = utils.getBody('DELETE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
