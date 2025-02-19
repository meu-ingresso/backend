import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import {
  CreateGuestListMemberValidator,
  UpdateGuestListMemberValidator,
} from 'App/Validators/v1/GuestListMembersValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';
import { DateTime } from 'luxon';

export default class GuestListMembersController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateGuestListMemberValidator);

    payload.added_by = context.auth.user!.id;

    const result = await this.dynamicService.create('GuestListMember', payload);

    await utils.createAudity('CREATE', 'GUEST_LIST_MEMBER', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();
    const body = utils.getBody('CREATE_SUCCESS', result);
    utils.getResponse(context, 201, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateGuestListMemberValidator);

    const oldData = await this.dynamicService.getById('GuestListMember', payload.id);

    if (payload.validated === true) {
      payload.validated_by = context.auth.user!.id;
      // @ts-ignore
      payload.validated_at = DateTime.now().setZone('America/Sao_Paulo');
    }

    const result = await this.dynamicService.update('GuestListMember', payload);

    await utils.createAudity(
      'UPDATE',
      'GUEST_LIST_MEMBER',
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

    const result = await this.dynamicService.searchActives('GuestListMember', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('GuestListMember', id);

    const result = await this.dynamicService.softDelete('GuestListMember', { id });

    await utils.createAudity(
      'DELETE',
      'GUEST_LIST_MEMBER',
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
