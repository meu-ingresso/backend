import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateUserValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    first_name: schema.string(),
    last_name: schema.string(),
    cellphone: schema.string(),
    email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string(),
    id_erp: schema.string.optional(),
    hiring_mode: schema.string(),
    role_id: schema.string.optional(),
    is_active: schema.boolean(),
  });

  public messages = {};
}

class UpdateUserValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    first_name: schema.string.optional(),
    last_name: schema.string.optional(),
    email: schema.string.optional({}, [rules.email()]),
    cellphone: schema.string.optional(),
    password: schema.string.optional(),
    id_erp: schema.string.optional(),
    hiring_mode: schema.string.optional(),
    role_id: schema.string.optional(),
    is_active: schema.boolean.optional(),
  });

  public messages = {};
}

export { CreateUserValidator, UpdateUserValidator };
