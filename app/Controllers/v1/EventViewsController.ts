import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { CreateEventViewValidator } from 'App/Validators/v1/EventViewsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import EventViewService from 'App/Services/v1/EventViewService';
import utils from 'Utils/utils';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';

export default class EventViewsController {
  private dynamicService: DynamicService = new DynamicService();
  private eventViewService: EventViewService = new EventViewService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventViewValidator);

    let result: any = {};
    let shouldCreateNewRecord = true;

    if (payload.data[0].session) {
      result = await this.eventViewService.searchBySession(payload.data[0].session);

      if (result) {
        const createdAt = DateTime.fromISO(result.created_at);
        const thirtyMinutesFromCreation = createdAt.plus({ minutes: 30 });

        if (DateTime.local() < thirtyMinutesFromCreation) {
          shouldCreateNewRecord = false;
        }
      } else {
        return utils.handleError(context, 404, 'SESSION_NOT_FOUND', 'Sessão não encontrada');
      }
    }

    if (shouldCreateNewRecord) {
      payload.data[0].session = uuidv4();

      result = await this.dynamicService.bulkCreate({
        modelName: 'EventView',
        records: payload.data,
        userId: context.auth.user?.$attributes.id,
      });
    }

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }
}
