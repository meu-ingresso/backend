import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreatePeopleValidator, UpdatePeopleValidator } from 'App/Validators/v1/PeopleValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class PeopleController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreatePeopleValidator);

    const result = await this.dynamicService.bulkCreate({
      modelName: 'People',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'CREATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdatePeopleValidator);

    const ableToUpdate = await utils.checkHasAdminPermission(context.auth.user!.id);

    const user = await this.dynamicService.search('User', {
      where: { id: { v: context.auth.user!.id } },
    });

    const isOwnPeople =
      payload.data[0].id === (user && user.data && user.data.length > 0 ? user.data[0].people_id : null);

    if (!ableToUpdate && !isOwnPeople) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'Você não tem permissão para atualizar este registro.');
    }

    const result = await this.dynamicService.bulkUpdate({
      modelName: 'People',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'UPDATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'UPDATE_SUCCESS', 200);
  }

  public async search(context: HttpContextContract) {
    const query = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.search('People', query);

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const ableToDelete = await utils.checkHasAdminPermission(context.auth.user!.id);

    const user = await this.dynamicService.search('User', {
      where: { id: { v: context.auth.user!.id } },
    });

    const isOwnPeople = id === (user && user.data && user.data.length > 0 ? user.data[0].people_id : null);

    if (!ableToDelete && !isOwnPeople) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'Você não tem permissão para excluir este registro.');
    }

    const result = await this.dynamicService.softDelete({
      modelName: 'People',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }
}
