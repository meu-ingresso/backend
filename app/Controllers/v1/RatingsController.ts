import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import RatingsService from 'App/Services/v1/RatingsService';
import { CreateRatingValidator, UpdateRatingValidator } from 'App/Validators/v1/RatingsValidator';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import utils from 'Utils/utils';

export default class RatingsController {
  private ratingsService: RatingsService = new RatingsService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateRatingValidator);

    const result = await this.ratingsService.create(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateRatingValidator);

    const result = await this.ratingsService.update(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.ratingsService.search(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
