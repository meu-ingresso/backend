import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventCollaboratorValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
    user_id: schema.string({ trim: true }, [rules.exists({ table: 'users', column: 'id' })]),
    role_id: schema.string({ trim: true }, [rules.exists({ table: 'roles', column: 'id' })]),
  });

  public messages = {
    'event_id.required': 'O campo "event_id" é obrigatório.',
    'event_id.exists': 'O "event_id" fornecido não existe.',
    'user_id.required': 'O campo "user_id" é obrigatório.',
    'user_id.exists': 'O "user_id" fornecido não existe.',
    'role_id.required': 'O campo "role_id" é obrigatório.',
    'role_id.exists': 'O "role_id" fornecido não existe.',
  };
}

class UpdateEventCollaboratorValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }),
    event_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
    user_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'users', column: 'id' })]),
    role_id: schema.string.optional({}, [rules.exists({ table: 'roles', column: 'id' })]),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'event_id.exists': 'O "event_id" fornecido não existe.',
    'user_id.exists': 'O "user_id" fornecido não existe.',
    'role_id.exists': 'A "role" fornecida não existe.',
  };
}

export { CreateEventCollaboratorValidator, UpdateEventCollaboratorValidator };
