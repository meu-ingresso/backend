import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreatePdvTicketsValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        pdv_id: schema.string({}, [rules.exists({ table: 'pdvs', column: 'id' })]),
        ticket_id: schema.string({}, [rules.exists({ table: 'tickets', column: 'id' })]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.pdv_id.required': 'O campo "pdv_id" é obrigatório.',
    'data.*.pdv_id.exists': 'O pdv especificado não existe.',
    'data.*.ticket_id.required': 'O campo "ticket_id" é obrigatório.',
    'data.*.ticket_id.exists': 'O ticket especificado não existe.',
  };
}

class UpdatePdvTicketsValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({}, [rules.exists({ table: 'pdv_tickets', column: 'id' })]),
        pdv_id: schema.string.optional({}, [rules.exists({ table: 'pdvs', column: 'id' })]),
        ticket_id: schema.string.optional({}, [rules.exists({ table: 'tickets', column: 'id' })]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O pdv ticket especificado não existe.',
    'data.*.pdv_id.exists': 'O pdv especificado não existe.',
    'data.*.ticket_id.exists': 'O ticket especificado não existe.',
  };
}

export { CreatePdvTicketsValidator, UpdatePdvTicketsValidator };
