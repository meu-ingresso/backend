import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import {
  CreateGuestListMemberValidatedValidator,
  UpdateGuestListMemberValidatedValidator,
} from 'App/Validators/v1/GuestListMembersValidatedValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class GuestListMembersController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateGuestListMemberValidatedValidator);

    // @ts-ignore
    payload.added_by = context.auth.user!.id;

    const result = await this.dynamicService.create('GuestListMemberValidated', payload);

    utils.createAudity(
      'CREATE',
      'GUEST_LIST_MEMBER_VALIDATED',
      result.id,
      context.auth.user?.$attributes.id,
      null,
      result
    );

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 201, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateGuestListMemberValidatedValidator);

    const oldData = await this.dynamicService.getById('GuestListMemberValidated', payload.id);

    const result = await this.dynamicService.update('GuestListMemberValidated', payload);

    utils.createAudity(
      'UPDATE',
      'GUEST_LIST_MEMBER_VALIDATED',
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

    const result = await this.dynamicService.searchActives('GuestListMemberValidated', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('GuestListMemberValidated', id);

    const result = await this.dynamicService.delete('GuestListMemberValidated', { id });

    utils.createAudity(
      'DELETE',
      'GUEST_LIST_MEMBER_VALIDATED',
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
