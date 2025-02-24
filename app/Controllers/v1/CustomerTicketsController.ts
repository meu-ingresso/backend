import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import {
  CreateCustomerTicketValidator,
  UpdateCustomerTicketValidator,
} from 'App/Validators/v1/CustomerTicketsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';
import { DateTime } from 'luxon';
import StatusService from 'App/Services/v1/StatusService';
export default class CustomerTicketsController {
  private dynamicService: DynamicService = new DynamicService();
  private statusService: StatusService = new StatusService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateCustomerTicketValidator);

    const result = await this.dynamicService.bulkCreate({
      modelName: 'CustomerTicket',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateCustomerTicketValidator);

    payload.data = await Promise.all(
      payload.data.map(async (record) => {
        if (record.validated) {
          const statusValidated = await this.statusService.searchStatusByName('Validado', 'customer_ticket');

          record.validated_by = context.auth.user!.id;
          record.validated_at = DateTime.now().toISO();
          record.status_id = statusValidated?.id;
        } else {
          // @ts-ignore
          record.validated_by = null;
          // @ts-ignore
          record.validated_at = null;
        }
        return record;
      })
    );

    const result = await this.dynamicService.bulkUpdate({
      modelName: 'CustomerTicket',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'UPDATE_SUCCESS', 200);
  }

  public async search(context: HttpContextContract) {
    const query = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.searchActives('CustomerTicket', query);

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const result = await this.dynamicService.softDelete({
      modelName: 'CustomerTicket',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }
}
