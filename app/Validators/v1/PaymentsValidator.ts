import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class CreatePaymentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    user_id: schema.string({}, [rules.exists({ table: 'users', column: 'id' })]),
    status_id: schema.string({}, [rules.exists({ table: 'statuses', column: 'id' })]),
    payment_method: schema.string(),
    gross_value: schema.number(),
    net_value: schema.number.optional(),
    paid_at: schema.date.optional(),
  });

  public messages = {};
}

export class UpdatePaymentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    user_id: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
    status_id: schema.string.optional({}, [rules.exists({ table: 'statuses', column: 'id' })]),
    payment_method: schema.string.optional(),
    gross_value: schema.number.optional(),
    net_value: schema.number.optional(),
    paid_at: schema.date.optional(),
  });

  public messages = {};
}
