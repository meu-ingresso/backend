import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateCustomerTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    ticket_id: schema.string({}, [rules.exists({ table: 'tickets', column: 'id' })]),
    current_owner_id: schema.string({}, [rules.exists({ table: 'people', column: 'id' })]),
    previous_owner_id: schema.string.optional({}, [rules.exists({ table: 'people', column: 'id' })]),
    status: schema.string({}, [rules.exists({ table: 'status', column: 'id' })]),
    validated_by: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
    validated_at: schema.date.optional(),
  });

  public messages = {
    'ticket_id.required': 'O ID do ingresso é obrigatório.',
    'ticket_id.exists': 'O ingresso fornecido não existe.',
    'current_owner_id.required': 'O ID do proprietário atual é obrigatório.',
    'current_owner_id.exists': 'O proprietário atual fornecido não existe.',
    'previous_owner_id.exists': 'O proprietário anterior fornecido não existe.',
    'status.required': 'O status é obrigatório.',
    'status.exists': 'O status fornecido não existe.',
    'validated_by.exists': 'O validador fornecido não existe.',
  };
}

class UpdateCustomerTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({}, [rules.exists({ table: 'customer_tickets', column: 'id' })]),
    ticket_id: schema.string.optional({}, [rules.exists({ table: 'tickets', column: 'id' })]),
    current_owner_id: schema.string.optional({}, [rules.exists({ table: 'people', column: 'id' })]),
    previous_owner_id: schema.string.optional({}, [rules.exists({ table: 'people', column: 'id' })]),
    status: schema.string.optional({}, [rules.exists({ table: 'status', column: 'id' })]),
    validated_by: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
    validated_at: schema.date.optional(),
  });

  public messages = {
    'id.required': 'O ID do ingresso do cliente é obrigatório.',
    'id.exists': 'O ingresso do cliente fornecido não existe.',
    'ticket_id.exists': 'O ingresso fornecido não existe.',
    'current_owner_id.exists': 'O proprietário atual fornecido não existe.',
    'previous_owner_id.exists': 'O proprietário anterior fornecido não existe.',
    'status.exists': 'O status fornecido não existe.',
    'validated_by.exists': 'O validador fornecido não existe.',
  };
}

export { CreateCustomerTicketValidator, UpdateCustomerTicketValidator };
