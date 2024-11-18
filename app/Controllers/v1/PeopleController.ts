import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PeopleService from 'App/Services/v1/PeopleService';
import { CreatePersonValidator, UpdatePersonValidator } from 'App/Validators/v1/PeopleValidator';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import utils from 'Utils/utils';

export default class PeopleController {
  private peopleService: PeopleService = new PeopleService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreatePersonValidator);

    const result = await this.peopleService.create(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    console.log('PeopleController.update');
    const payload = await context.request.validate(UpdatePersonValidator);

    console.log('PeopleController.payload', payload);

    const result = await this.peopleService.update(payload);

    console.log('PeopleController.result', result);

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.peopleService.search(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
