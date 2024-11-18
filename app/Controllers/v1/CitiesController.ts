import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { CreateCityValidator, UpdateCityValidator } from 'App/Validators/v1/CitiesValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class AddressesController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateCityValidator);

    const result = await this.dynamicService.create('City', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateCityValidator);

    const result = await this.dynamicService.update('City', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const query = context.request.qs();

    const result = await this.dynamicService.search('City', query);

    const headers = utils.getHeaders();
    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
