import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class CreateCustomerTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    ticket_id: schema.string({}, [rules.exists({ table: 'tickets', column: 'id' })]),
    owner_name: schema.string(),
    owner_email: schema.string({}, [rules.email()]),
    owner_tax: schema.string.optional(),
    status: schema.string.optional(),
    ticket_identifier: schema.string.optional(),
    validated: schema.boolean.optional(),
  });

  public messages = {};
}

export class UpdateCustomerTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    ticket_id: schema.string.optional({}, [rules.exists({ table: 'tickets', column: 'id' })]),
    owner_name: schema.string.optional(),
    owner_email: schema.string.optional({}, [rules.email()]),
    owner_tax: schema.string.optional(),
    status: schema.string.optional(),
    ticket_identifier: schema.string.optional(),
    validated: schema.boolean.optional(),
  });

  public messages = {};
}
