import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import CategoriesService from 'App/Services/v1/CategoriesService';
import { CreateCategoryValidator, UpdateCategoryValidator } from 'App/Validators/v1/CategoriesValidator';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import utils from 'Utils/utils';

export default class CategoriesController {
  private categoriesService: CategoriesService = new CategoriesService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateCategoryValidator);

    const result = await this.categoriesService.create(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateCategoryValidator);

    const result = await this.categoriesService.update(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.categoriesService.search(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
