import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateTicketFieldValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        customer_ticket_id: schema.string({ trim: true }, [rules.exists({ table: 'customer_tickets', column: 'id' })]),
        field_id: schema.string({ trim: true }, [rules.exists({ table: 'event_checkout_fields', column: 'id' })]),
        value: schema.string({ trim: true }),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.customer_ticket_id.required': 'O campo "customer_ticket_id" é obrigatório.',
    'data.*.customer_ticket_id.exists': 'O campo "customer_ticket_id" deve referenciar um ticket válido.',
    'data.*.field_id.required': 'O campo "field_id" é obrigatório.',
    'data.*.field_id.exists': 'O campo "field_id" deve referenciar um campo válido.',
    'data.*.value.required': 'O campo "value" é obrigatório.',
  };
}

class UpdateTicketFieldValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }, [rules.exists({ table: 'tickets_fields', column: 'id' })]),
        customer_ticket_id: schema.string.optional({ trim: true }, [
          rules.exists({ table: 'customer_tickets', column: 'id' }),
        ]),
        field_id: schema.string.optional({ trim: true }, [
          rules.exists({ table: 'event_checkout_fields', column: 'id' }),
        ]),
        value: schema.string.optional({ trim: true }),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.exists': 'O campo não existe.',
    'data.*.customer_ticket_id.exists': 'O campo "customer_ticket_id" deve referenciar um ticket válido.',
    'data.*.field_id.exists': 'O campo "field_id" deve referenciar um campo válido.',
    'data.*.value.string': 'O campo "value" precisa ser uma string válida.',
  };
}

export { CreateTicketFieldValidator, UpdateTicketFieldValidator };
