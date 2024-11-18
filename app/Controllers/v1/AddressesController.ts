import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import AddressService from 'App/Services/v1/AddressesService';
import { CreateAddressValidator, UpdateAddressValidator } from 'App/Validators/v1/AddressesValidator';
import utils from 'Utils/utils';

export default class AddressesController {
  private addressService: AddressService = new AddressService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateAddressValidator);

    const result = await this.addressService.create(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateAddressValidator);

    const result = await this.addressService.update(payload);

    // utils.createAudity(context.auth.user?.$attributes.id, 'address', 'update', result.id, null, payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const query = context.request.qs();

    const result = await this.addressService.search(query);

    const headers = utils.getHeaders();
    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
