import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import CitiesService from 'App/Services/v1/CitiesService';
import { CreateCityValidator, UpdateCityValidator } from 'App/Validators/v1/CitiesValidator';
import utils from 'Utils/utils';

export default class AddressesController {
  private citiesService: CitiesService = new CitiesService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateCityValidator);

    const result = await this.citiesService.create(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateCityValidator);

    const result = await this.citiesService.update(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const query = context.request.qs();

    const result = await this.citiesService.search(query);

    const headers = utils.getHeaders();
    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
