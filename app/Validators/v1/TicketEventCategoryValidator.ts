import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateTicketEventCategoryValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
    name: schema.string({ trim: true }),
  });

  public messages = {
    'event_id.required': 'O campo "event_id" é obrigatório.',
    'event_id.exists': 'O "event_id" fornecido não existe na tabela de eventos.',
    'name.required': 'O campo "name" é obrigatório.',
    'name.string': 'O campo "name" deve ser uma string válida.',
  };
}

class UpdateTicketEventCategoryValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }),
    event_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
    name: schema.string.optional({ trim: true }),,
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'event_id.exists': 'O "event_id" fornecido não existe na tabela de eventos.',
    'event_id.string': 'O campo "event_id" deve ser uma string válida.',
    'name.string': 'O campo "name" deve ser uma string válida.',
  };
}

export { CreateTicketEventCategoryValidator, UpdateTicketEventCategoryValidator };
