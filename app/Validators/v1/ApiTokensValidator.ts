import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class CreateApiTokenValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    user_id: schema.string({}, [rules.exists({ table: 'users', column: 'id' })]),
    name: schema.string(),
    type: schema.string(),
    token: schema.string({}, [rules.unique({ table: 'api_tokens', column: 'token' })]),
    expires_at: schema.date.optional(),
  });

  public messages = {};
}

export class UpdateApiTokenValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    user_id: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
    name: schema.string.optional(),
    type: schema.string.optional(),
    token: schema.string.optional(),
    expires_at: schema.date.optional(),
  });

  public messages = {};
}
