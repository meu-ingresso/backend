import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateEventValidator, UpdateEventValidator } from 'App/Validators/v1/EventsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import EventService from 'App/Services/v1/EventService';
import utils from 'Utils/utils';

export default class EventsController {
  private dynamicService: DynamicService = new DynamicService();
  private eventService: EventService = new EventService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventValidator);

    const ableToCreate = await utils.checkHasEventPermission(context.auth.user!.id);

    if (!ableToCreate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    let group_id = payload.data[0].group_id || null;

    payload.data.forEach((event) => {
      delete event.group_id;
    });

    const result = await this.dynamicService.bulkCreate({
      modelName: 'Event',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'CREATE_ERROR', `${result[0].error}`);
    }

    const fees = result.map((element) => {
      return {
        event_id: element.id,
        platform_fee: 10,
      };
    });

    this.dynamicService.bulkCreate({
      modelName: 'EventFee',
      records: fees,
      userId: context.auth.user?.$attributes.id,
    });

    if (!group_id) {
      const groupPayload = {
        name: payload.data[0].name + ' - ' + result[0].id,
        description: payload.data[0].description,
      };

      const group = await this.dynamicService.create('EventGroup', groupPayload);

      group_id = group.id;
    }

    this.dynamicService.bulkCreate({
      modelName: 'EventGroupRelation',
      records: result.map((event) => {
        return {
          group_id,
          event_id: event.id,
        };
      }),
    });

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async validateAlias(context: HttpContextContract) {
    const alias = context.request.params().alias;

    const result = await this.eventService.validateAlias(alias);

    return utils.handleSuccess(context, result, 'VALIDATE_SUCCESS', 200);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateEventValidator);

    const oldData = await this.dynamicService.getById('Event', payload.data[0].id);
    const ableToUpdate = await utils.checkHasEventPermission(context.auth.user!.id, oldData.id);

    if (!ableToUpdate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.bulkUpdate({
      modelName: 'Event',
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

    const result = await this.dynamicService.search('Event', query);

    if (result && result.data && !!result.data.length) {
      for (let i = 0; i < result.data.length; i++) {
        const totalizer = await this.eventService.getTotalizers(result.data[i].id);
        result.data[i].totalizers = totalizer;
      }
    }

    const resultByRole = await utils.getInfosByRole(context.auth.user!.id, result, 'Event');

    return utils.handleSuccess(context, resultByRole, 'SEARCH_SUCCESS', 200);
  }

  public async showcase(context: HttpContextContract) {
    const query = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.search('Event', query);

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('Event', id);
    const ableToDelete = await utils.checkHasEventPermission(context.auth.user!.id, oldData.id);

    if (!ableToDelete) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.softDelete({
      modelName: 'Event',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }
}
