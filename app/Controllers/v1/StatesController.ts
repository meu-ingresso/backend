import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import StatesService from 'App/Services/v1/StatesService';
import { CreateStateValidator, UpdateStateValidator } from 'App/Validators/v1/StatesValidator';
import utils from 'Utils/utils';

export default class AddressesController {
  private statesService: StatesService = new StatesService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateStateValidator);

    const result = await this.statesService.create(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateStateValidator);

    const result = await this.statesService.update(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const query = context.request.qs();

    const result = await this.statesService.search(query);

    const headers = utils.getHeaders();
    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
