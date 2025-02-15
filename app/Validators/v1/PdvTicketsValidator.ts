import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreatePdvTicketsValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    pdv_id: schema.string({}, [rules.exists({ table: 'pdvs', column: 'id' })]),
    ticket_id: schema.string({}, [rules.exists({ table: 'tickets', column: 'id' })]),
  });

  public messages = {
    'pdv_id.required': 'O campo "pdv_id" é obrigatório.',
    'pdv_id.exists': 'O pdv especificado não existe.',
    'ticket_id.required': 'O campo "ticket_id" é obrigatório.',
    'ticket_id.exists': 'O ticket especificado não existe.',
  };
}

class UpdatePdvTicketsValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({}, [rules.exists({ table: 'pdv_tickets', column: 'id' })]),
    pdv_id: schema.string.optional({}, [rules.exists({ table: 'pdvs', column: 'id' })]),
    ticket_id: schema.string.optional({}, [rules.exists({ table: 'tickets', column: 'id' })]),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.exists': 'O pdv ticket especificado não existe.',
    'pdv_id.exists': 'O pdv especificado não existe.',
    'ticket_id.exists': 'O ticket especificado não existe.',
  };
}

export { CreatePdvTicketsValidator, UpdatePdvTicketsValidator };
