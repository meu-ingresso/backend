import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class CreateUserValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string(),
    role_id: schema.string(),
    is_active: schema.boolean(),
  });

  public messages = {};
}

export class UpdateUserValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    email: schema.string.optional({}, [rules.email()]),
    password: schema.string.optional(),
    role_id: schema.string.optional(),
    is_active: schema.boolean.optional(),
  });

  public messages = {};
}
