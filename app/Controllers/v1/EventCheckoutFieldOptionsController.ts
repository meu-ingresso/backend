import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import {
  CreateEventCheckoutFieldOptionValidator,
  UpdateEventCheckoutFieldOptionValidator,
} from 'App/Validators/v1/EventCheckoutFieldOptionsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class EventCheckoutFieldOptionsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventCheckoutFieldOptionValidator);

    const eventCheckoutField = await this.dynamicService.getById(
      'EventCheckoutField',
      payload.data[0].event_checkout_field_id
    );

    const ableToCreate = await utils.checkHasEventPermission(context.auth.user!.id, eventCheckoutField.event_id);

    if (!ableToCreate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.bulkCreate({
      modelName: 'EventCheckoutFieldOption',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateEventCheckoutFieldOptionValidator);

    const result = await this.dynamicService.bulkUpdate({
      modelName: 'EventCheckoutFieldOption',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'UPDATE_SUCCESS', 200);
  }

  public async search(context: HttpContextContract) {
    const query = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.searchActives('EventCheckoutFieldOption', query);

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const option = await this.dynamicService.getById('EventCheckoutFieldOption', id);
    const eventCheckoutField = await this.dynamicService.getById('EventCheckoutField', option.event_checkout_field_id);
    const ableToDelete = await utils.checkHasEventPermission(context.auth.user!.id, eventCheckoutField.event_id);

    if (!ableToDelete) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.softDelete({
      modelName: 'EventCheckoutFieldOption',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }
}
