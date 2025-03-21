import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateEventFeeValidator, UpdateEventFeeValidator } from 'App/Validators/v1/EventFeesValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class EventFeesController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventFeeValidator);

    const ableToCreate = await utils.checkHasEventPermission(context.auth.user!.id, payload.data[0].event_id);

    if (!ableToCreate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.bulkCreate({
      modelName: 'EventFee',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'CREATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateEventFeeValidator);

    const oldData = await this.dynamicService.getById('EventFee', payload.data[0].id);
    const ableToUpdate = await utils.checkHasEventPermission(context.auth.user!.id, oldData.event_id);

    if (!ableToUpdate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.bulkUpdate({
      modelName: 'EventFee',
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

    const result = await this.dynamicService.search('EventFee', query);

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('EventFee', id);
    const ableToDelete = await utils.checkHasEventPermission(context.auth.user!.id, oldData.event_id);

    if (!ableToDelete) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.softDelete({
      modelName: 'EventFee',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }
}
