import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class CreateAuditLogValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    action: schema.string(),
    entity: schema.string(),
    entity_id: schema.string.optional(),
    user_id: schema.string.optional({}, [rules.exists({ table: 'user', column: 'id' })]),
    old_data: schema.object.optional().members({}),
    new_data: schema.object.optional().members({}),
  });

  public messages = {};
}

export class UpdateAuditLogValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    action: schema.string.optional(),
    entity: schema.string.optional(),
    entity_id: schema.string.optional(),
    user_id: schema.string.optional({}, [rules.exists({ table: 'user', column: 'id' })]),
    old_data: schema.object.optional().members({}),
    new_data: schema.object.optional().members({}),
  });

  public messages = {};
}
