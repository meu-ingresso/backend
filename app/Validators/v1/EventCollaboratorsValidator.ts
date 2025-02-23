import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventCollaboratorValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        event_id: schema.string({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
        user_id: schema.string({ trim: true }, [rules.exists({ table: 'users', column: 'id' })]),
        role_id: schema.string({ trim: true }, [rules.exists({ table: 'roles', column: 'id' })]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.event_id.required': 'O campo "event_id" é obrigatório.',
    'data.*.event_id.exists': 'O "event_id" fornecido não existe.',
    'data.*.user_id.required': 'O campo "user_id" é obrigatório.',
    'data.*.user_id.exists': 'O "user_id" fornecido não existe.',
    'data.*.role_id.required': 'O campo "role_id" é obrigatório.',
    'data.*.role_id.exists': 'O "role_id" fornecido não existe.',
  };
}

class UpdateEventCollaboratorValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }, [rules.exists({ table: 'event_collaborators', column: 'id' })]),
        event_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
        user_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'users', column: 'id' })]),
        role_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'roles', column: 'id' })]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O "id" fornecido não existe na tabela de colaboradores.',
    'data.*.event_id.exists': 'O "event_id" fornecido não existe.',
    'data.*.user_id.exists': 'O "user_id" fornecido não existe.',
    'data.*.role_id.exists': 'A "role" fornecida não existe.',
  };
}

export { CreateEventCollaboratorValidator, UpdateEventCollaboratorValidator };
