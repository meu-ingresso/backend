import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import {
  CreateGuestListMemberValidatedValidator,
  UpdateGuestListMemberValidatedValidator,
} from 'App/Validators/v1/GuestListMembersValidatedValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class GuestListMembersValidatedController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateGuestListMemberValidatedValidator);

    payload.data.forEach((item) => {
      item.validated_by = context.auth.user!.id;
    });

    const result = await this.dynamicService.bulkCreate({
      modelName: 'GuestListMemberValidated',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'CREATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateGuestListMemberValidatedValidator);

    const result = await this.dynamicService.bulkUpdate({
      modelName: 'GuestListMemberValidated',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'UPDATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'UPDATE_SUCCESS', 200);
  }

  public async search(context: HttpContextContract) {
    const query = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.search('GuestListMemberValidated', query);

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const result = await this.dynamicService.delete({
      modelName: 'GuestListMemberValidated',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }
}
