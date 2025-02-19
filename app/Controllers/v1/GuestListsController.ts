import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateGuestListValidator, UpdateGuestListValidator } from 'App/Validators/v1/GuestListsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class GuestListsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateGuestListValidator);

    payload.created_by = context.auth.user!.id;

    const result = await this.dynamicService.create('GuestList', payload);

    await utils.createAudity('CREATE', 'GUEST_LIST', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();
    const body = utils.getBody('CREATE_SUCCESS', result);
    utils.getResponse(context, 201, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateGuestListValidator);

    const oldData = await this.dynamicService.getById('GuestList', payload.id);

    const result = await this.dynamicService.update('GuestList', payload);

    await utils.createAudity(
      'UPDATE',
      'GUEST_LIST',
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

    const result = await this.dynamicService.searchActives('GuestList', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('GuestList', id);

    const result = await this.dynamicService.softDelete('GuestList', { id });

    await utils.createAudity(
      'DELETE',
      'GUEST_LIST',
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
