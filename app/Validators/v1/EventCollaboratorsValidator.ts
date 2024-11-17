import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class CreateEventCollaboratorValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
    user_id: schema.string({}, [rules.exists({ table: 'users', column: 'id' })]),
    role: schema.string(),
  });

  public messages = {};
}

export class UpdateEventCollaboratorValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    event_id: schema.string.optional({}, [rules.exists({ table: 'events', column: 'id' })]),
    user_id: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
    role: schema.string.optional(),
  });

  public messages = {};
}
