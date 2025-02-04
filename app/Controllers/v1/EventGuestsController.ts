import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateEventGuestValidator, UpdateEventGuestValidator } from 'App/Validators/v1/EventGuestsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';
import { DateTime } from 'luxon';

export default class EventGuestsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventGuestValidator);

    const ableToCreate = await utils.checkHasEventPermission(context.auth.user!.id, payload.event_id);

    if (!ableToCreate) {
      return utils.getResponse(context, 403, utils.getHeaders(), utils.getBody('FORBIDDEN', null));
    }

    const result = await this.dynamicService.create('EventGuest', payload);

    await utils.createAudity('CREATE', 'EVENT_GUEST', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 201, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateEventGuestValidator);

    const oldData = await this.dynamicService.getById('EventGuest', payload.id);

    const ableToUpdate = await utils.checkHasEventPermission(context.auth.user!.id, oldData.event_id);

    if (!ableToUpdate) {
      return utils.getResponse(context, 403, utils.getHeaders(), utils.getBody('FORBIDDEN', null));
    }

    if (payload.validated) {
      payload.validated_by = context.auth.user?.$attributes.id;
      payload.validated_at = DateTime.now().setZone('America/Sao_Paulo') as DateTime<true>;
    }

    const result = await this.dynamicService.update('EventGuest', payload);

    await utils.createAudity(
      'UPDATE',
      'EVENT_GUEST',
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

    const result = await this.dynamicService.search('EventGuest', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('EventGuest', id);

    const ableToDelete = await utils.checkHasEventPermission(context.auth.user!.id, oldData.event_id);

    if (!ableToDelete) {
      return utils.getResponse(context, 403, utils.getHeaders(), utils.getBody('FORBIDDEN', null));
    }

    const result = await this.dynamicService.softDelete('EventGuest', { id });

    await utils.createAudity(
      'DELETE',
      'EVENT_GUEST',
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
