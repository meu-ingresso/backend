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

    const result = await this.dynamicService.create('Event', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateEventValidator);

    const result = await this.dynamicService.update('Event', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.search('Event', payload);

    if (result && result.data && !!result.data.length) {
      for (let i = 0; i < result.data.length; i++) {
        const totalizer = await this.eventService.getTotalizers(result.data[i].id);
        result.data[i].totalizers = totalizer;
      }
    }

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
