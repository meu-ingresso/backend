import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class CreateTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
    name: schema.string(),
    tier: schema.number(),
    total_quantity: schema.number(),
    remaining_quantity: schema.number(),
    price: schema.number(),
    is_active: schema.boolean(),
  });

  public messages = {};
}

export class UpdateTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    event_id: schema.string.optional({}, [rules.exists({ table: 'events', column: 'id' })]),
    name: schema.string.optional(),
    tier: schema.number.optional(),
    total_quantity: schema.number.optional(),
    remaining_quantity: schema.number.optional(),
    price: schema.number.optional(),
    is_active: schema.boolean.optional(),
  });

  public messages = {};
}
