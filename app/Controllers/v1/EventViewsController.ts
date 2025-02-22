import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { CreateEventViewValidator } from 'App/Validators/v1/EventViewsValidator';
import EventViewService from 'App/Services/v1/EventViewService';
import utils from 'Utils/utils';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';

export default class EventViewsController {
  private eventViewService: EventViewService = new EventViewService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventViewValidator);

    let result: any = {};
    let shouldCreateNewRecord = true;

    if (payload.session) {
      result = await this.eventViewService.searchBySession(payload.session);

      if (result) {
        const createdAt = DateTime.fromISO(result.created_at);

        const thirtyMinutesFromCreation = createdAt.plus({ minutes: 30 });

        if (DateTime.local() < thirtyMinutesFromCreation) {
          shouldCreateNewRecord = false;
        }
      } else {
        const headers = utils.getHeaders();

        const body = utils.getBody('SESSION_NOT_FOUND', null);

        return utils.getResponse(context, 404, headers, body);
      }
    }

    if (shouldCreateNewRecord) {
      payload.session = uuidv4();

      result = await this.eventViewService.create(payload);
    }

    utils.createAudity('CREATE', 'EVENT_VIEW', result?.id || null, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 201, headers, body);
  }
}
