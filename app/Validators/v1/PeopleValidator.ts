import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class CreatePersonValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    first_name: schema.string(),
    last_name: schema.string(),
    tax: schema.string.optional(),
    birth_date: schema.date(),
    phone: schema.string.optional(),
    email: schema.string({}, [rules.email(), rules.unique({ table: 'people', column: 'email' })]),
  });

  public messages = {};
}

export class UpdatePersonValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    first_name: schema.string.optional(),
    last_name: schema.string.optional(),
    tax: schema.string.optional(),
    birth_date: schema.date.optional(),
    phone: schema.string.optional(),
    email: schema.string.optional({}, [rules.email()]),
  });

  public messages = {};
}
