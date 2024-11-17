import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class CreateEventFeeValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
    platform_fee: schema.number(),
    promoter_fee: schema.number(),
    fixed_fee: schema.number.optional(),
    variable_fee: schema.number.optional(),
  });

  public messages = {};
}

export class UpdateEventFeeValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    event_id: schema.string.optional({}, [rules.exists({ table: 'events', column: 'id' })]),
    platform_fee: schema.number.optional(),
    promoter_fee: schema.number.optional(),
    fixed_fee: schema.number.optional(),
    variable_fee: schema.number.optional(),
  });

  public messages = {};
}
