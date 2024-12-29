import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import DynamicService from 'App/Services/v1/DynamicService';
import { CreateStateValidator, UpdateStateValidator } from 'App/Validators/v1/StatesValidator';
import utils from 'Utils/utils';

export default class AddressesController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateStateValidator);

    const result = await this.dynamicService.create('State', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateStateValidator);

    const result = await this.dynamicService.update('State', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const query = context.request.qs();

    const result = await this.dynamicService.search('State', query);

    const headers = utils.getHeaders();
    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const result = await this.dynamicService.softDelete('State', { id });

    const headers = utils.getHeaders();

    const body = utils.getBody('DELETE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
