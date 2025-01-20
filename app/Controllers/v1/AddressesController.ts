import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { CreateAddressValidator, UpdateAddressValidator } from 'App/Validators/v1/AddressesValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class AddressesController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateAddressValidator);

    const result = await this.dynamicService.create('Address', payload);

    await utils.createAudity('CREATE', 'ADDRESS', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 201, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateAddressValidator);

    const oldData = await this.dynamicService.getById('Address', payload.id);

    const result = await this.dynamicService.update('Address', payload);

    await utils.createAudity(
      'UPDATE',
      'ADDRESS',
      result.id,
      context.auth.user?.$attributes.id,
      oldData.$attributes,
      result
    );

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const query = context.request.qs();

    const result = await this.dynamicService.search('Address', query);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('Address', id);

    const result = await this.dynamicService.softDelete('Address', { id });

    await utils.createAudity('DELETE', 'ADDRESS', id, context.auth.user?.$attributes.id, oldData.$attributes, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('DELETE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
