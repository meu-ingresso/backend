import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import {
  CreateEventCollaboratorValidator,
  UpdateEventCollaboratorValidator,
} from 'App/Validators/v1/EventCollaboratorsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class EventCollaboratorsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventCollaboratorValidator);

    const ableToCreate = await utils.checkHasEventPermission(context.auth.user!.id, payload.event_id);

    if (!ableToCreate) {
      return utils.getResponse(context, 403, utils.getHeaders(), utils.getBody('FORBIDDEN', null));
    }

    const result = await this.dynamicService.create('EventCollaborator', payload);

    await utils.createAudity(
      'CREATE',
      'EVENT_COLLABORATOR',
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
    const payload = await context.request.validate(UpdateEventCollaboratorValidator);

    const oldData = await this.dynamicService.getById('EventCollaborator', payload.id);

    const ableToUpdate = await utils.checkHasEventPermission(context.auth.user!.id, oldData.event_id);

    if (!ableToUpdate) {
      return utils.getResponse(context, 403, utils.getHeaders(), utils.getBody('FORBIDDEN', null));
    }

    const result = await this.dynamicService.update('EventCollaborator', payload);

    await utils.createAudity(
      'UPDATE',
      'EVENT_COLLABORATOR',
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

    const result = await this.dynamicService.searchActives('EventCollaborator', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('EventCollaborator', id);

    const ableToDelete = await utils.checkHasEventPermission(context.auth.user!.id, oldData.event_id);

    if (!ableToDelete) {
      return utils.getResponse(context, 403, utils.getHeaders(), utils.getBody('FORBIDDEN', null));
    }

    const result = await this.dynamicService.softDelete('EventCollaborator', { id });

    await utils.createAudity(
      'DELETE',
      'EVENT_COLLABORATOR',
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
