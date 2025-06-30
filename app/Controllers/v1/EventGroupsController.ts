import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateEventGroupValidator } from 'App/Validators/v1/EventGroupsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import EventTotalizersService from 'App/Services/v1/EventTotalizersService';
import utils from 'Utils/utils';

export default class EventGroupsController {
  private dynamicService: DynamicService = new DynamicService();
  private eventTotalizersService: EventTotalizersService = new EventTotalizersService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventGroupValidator);

    const result = await this.dynamicService.bulkCreate({
      modelName: 'EventGroup',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'CREATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async search(context: HttpContextContract) {
    const query = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.search('EventGroup', query);

    // Verifica se há preload de eventos e adiciona totalizadores se necessário
    if (this.eventTotalizersService.hasEventsPreload(query) && result.data) {
      const dataWithTotalizers = await this.eventTotalizersService.addTotalizersToEvents(result.data);
      result.data = dataWithTotalizers;
    }

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const result = await this.dynamicService.delete({
      modelName: 'EventGroup',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }
}
