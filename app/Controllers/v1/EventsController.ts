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
      return utils.getResponse(context, 403, utils.getHeaders(), utils.getBody('FORBIDDEN', null));
    }

    const result = await this.dynamicService.create('Event', payload);

    this.dynamicService.create('EventFees', {
      event_id: result.id,
      platform_fee: 10,
    });

    await utils.createAudity('CREATE', 'EVENT', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 201, headers, body);
  }

  public async validateAlias(context: HttpContextContract) {
    const alias = context.request.params().alias;

    const result = await this.eventService.validateAlias(alias);

    const headers = utils.getHeaders();

    const body = utils.getBody('VALIDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateEventValidator);

    const oldData = await this.dynamicService.getById('Event', payload.id);

    const ableToUpdate = await utils.checkHasEventPermission(context.auth.user!.id, oldData.id);

    if (!ableToUpdate) {
      return utils.getResponse(context, 403, utils.getHeaders(), utils.getBody('FORBIDDEN', null));
    }

    const result = await this.dynamicService.update('Event', payload);

    await utils.createAudity(
      'UPDATE',
      'EVENT',
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

    const result = await this.dynamicService.searchActives('Event', payload);

    if (result && result.data && !!result.data.length) {
      for (let i = 0; i < result.data.length; i++) {
        const totalizer = await this.eventService.getTotalizers(result.data[i].id);
        result.data[i].totalizers = totalizer;
      }
    }

    const resultByRole = await utils.getInfosByRole(context.auth.user!.id, result, 'Event');

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', resultByRole);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('Event', id);

    const ableToDelete = await utils.checkHasEventPermission(context.auth.user!.id, oldData.id);

    if (!ableToDelete) {
      return utils.getResponse(context, 403, utils.getHeaders(), utils.getBody('FORBIDDEN', null));
    }

    const result = await this.dynamicService.softDelete('Event', { id });

    await utils.createAudity('DELETE', 'EVENT', id, context.auth.user?.$attributes.id, oldData.$attributes, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('DELETE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
