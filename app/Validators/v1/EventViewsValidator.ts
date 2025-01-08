import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventViewValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
    user_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'users', column: 'id' })]),
    session: schema.string.optional({ trim: true }),
    ip_address: schema.string.optional({ trim: true }),
  });

  public messages = {
    'event_id.required': 'O campo "event_id" é obrigatório.',
    'event_id.exists': 'O "event_id" fornecido não existe na tabela de eventos.',
    'user_id.required': 'O campo "user_id" é obrigatório.',
    'user_id.exists': 'O "user_id" fornecido não existe na tabela de usuários.',
    'session.string': 'O campo "session" deve ser uma string.',
    'ip_address.string': 'O campo "ip_address" deve ser uma string.',
  };
}

export { CreateEventViewValidator };
