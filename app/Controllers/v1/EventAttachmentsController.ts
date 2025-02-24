import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import {
  CreateEventAttachmentValidator,
  UpdateEventAttachmentValidator,
} from 'App/Validators/v1/EventAttachmentsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class EventAttachmentsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventAttachmentValidator);

    const ableToCreate = await utils.checkHasEventPermission(context.auth.user!.id, payload.data[0].event_id);

    if (!ableToCreate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.bulkCreate({
      modelName: 'EventAttachment',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateEventAttachmentValidator);

    const oldData = await this.dynamicService.getById('EventAttachment', payload.data[0].id);

    const ableToUpdate = await utils.checkHasEventPermission(context.auth.user!.id, oldData.event_id);

    if (!ableToUpdate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.bulkUpdate({
      modelName: 'EventAttachment',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'UPDATE_SUCCESS', 200);
  }

  public async search(context: HttpContextContract) {
    const query = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.searchActives('EventAttachment', query);

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('EventAttachment', id);

    const ableToDelete = await utils.checkHasEventPermission(context.auth.user!.id, oldData.event_id);

    if (!ableToDelete) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.softDelete({
      modelName: 'EventAttachment',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }
}
