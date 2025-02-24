import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import {
  CreateUserAttachmentValidator,
  UpdateUserAttachmentValidator,
} from 'App/Validators/v1/UserAttachmentsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class UserAttachmentsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateUserAttachmentValidator);

    const result = await this.dynamicService.bulkCreate({
      modelName: 'UserAttachment',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'CREATE_ERROR', `${result[0].error}`);
    }

    utils.createAudity('CREATE', 'USER_ATTACHMENT', result[0].id, context.auth.user?.$attributes.id, null, result);

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateUserAttachmentValidator);

    const oldData = await this.dynamicService.getById('UserAttachment', payload.data[0].id);

    const result = await this.dynamicService.bulkUpdate({
      modelName: 'UserAttachment',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'UPDATE_ERROR', `${result[0].error}`);
    }

    utils.createAudity(
      'UPDATE',
      'USER_ATTACHMENT',
      result[0].id,
      context.auth.user?.$attributes.id,
      oldData.$attributes,
      result
    );

    return utils.handleSuccess(context, result, 'UPDATE_SUCCESS', 200);
  }

  public async search(context: HttpContextContract) {
    const query = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.searchActives('UserAttachment', query);

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('UserAttachment', id);

    const result = await this.dynamicService.softDelete({
      modelName: 'UserAttachment',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    utils.createAudity('DELETE', 'USER_ATTACHMENT', id, context.auth.user?.$attributes.id, oldData.$attributes, result);

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }
}
