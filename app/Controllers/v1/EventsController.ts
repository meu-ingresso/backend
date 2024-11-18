import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import EventsService from 'App/Services/v1/EventsService';
import { CreateEventValidator, UpdateEventValidator } from 'App/Validators/v1/EventsValidator';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import utils from 'Utils/utils';

export default class EventsController {
  private eventsService: EventsService = new EventsService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventValidator);

    const result = await this.eventsService.create(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateEventValidator);

    const result = await this.eventsService.update(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.eventsService.search(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
