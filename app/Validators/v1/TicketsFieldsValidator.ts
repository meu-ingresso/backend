import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateTicketsFieldValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    customer_ticket_id: schema.string({ trim: true }, [rules.exists({ table: 'customer_tickets', column: 'id' })]),
    field_id: schema.string({ trim: true }, [rules.exists({ table: 'checkout_fields', column: 'id' })]),
    order: schema.number.optional(),
    value: schema.string({ trim: true }),
  });

  public messages = {
    'customer_ticket_id.required': 'O campo "customer_ticket_id" é obrigatório.',
    'customer_ticket_id.exists': 'O campo "customer_ticket_id" deve referenciar um ticket válido.',
    'field_id.required': 'O campo "field_id" é obrigatório.',
    'field_id.exists': 'O campo "field_id" deve referenciar um campo válido.',
    'value.required': 'O campo "value" é obrigatório.',
    'order.number': 'O campo "order" precisa ser um número válido.',
  };
}

class UpdateTicketsFieldValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }),
    customer_ticket_id: schema.string.optional({ trim: true }, [
      rules.exists({ table: 'customer_tickets', column: 'id' }),
    ]),
    field_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'checkout_fields', column: 'id' })]),
    order: schema.number.optional(),
    value: schema.string.optional({ trim: true }),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.exists': 'O campo "field_id" deve referenciar um campo válido.',
    'customer_ticket_id.exists': 'O campo "customer_ticket_id" deve referenciar um campo válido.',
    'field_id.exists': 'O campo "field_id" deve referenciar um campo válido.',
    'value.string': 'O campo "value" precisa ser uma string válida.',
    'order.number': 'O campo "order" precisa ser um número válido.',
  };
}

export { CreateTicketsFieldValidator, UpdateTicketsFieldValidator };
