import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateCustomerTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        ticket_id: schema.string({}, [rules.exists({ table: 'tickets', column: 'id' })]),
        current_owner_id: schema.string.optional({}, [rules.exists({ table: 'people', column: 'id' })]),
        previous_owner_id: schema.string.optional({}, [rules.exists({ table: 'people', column: 'id' })]),
        status_id: schema.string({}, [rules.exists({ table: 'statuses', column: 'id' })]),
        payment_id: schema.string({}, [rules.exists({ table: 'payments', column: 'id' })]),
        validated: schema.boolean.optional(),
        validated_by: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
        validated_at: schema.date.optional(),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.ticket_id.required': 'O campo "ticket_id" é obrigatório.',
    'data.*.ticket_id.exists': 'O ticket especificado não existe.',
    'data.*.current_owner_id.required': 'O campo "current_owner_id" é obrigatório.',
    'data.*.current_owner_id.exists': 'O proprietário atual especificado não existe.',
    'data.*.previous_owner_id.exists': 'O proprietário anterior especificado não existe.',
    'data.*.status_id.required': 'O campo "status_id" é obrigatório.',
    'data.*.status_id.exists': 'O status especificado não existe.',
    'data.*.payment_id.required': 'O campo "payment_id" é obrigatório.',
    'data.*.payment_id.exists': 'O pagamento especificado não existe.',
    'data.*.validated.boolean': 'O campo "validated" deve ser um valor booleano.',
    'data.*.validated_by.exists': 'O usuário de validação especificado não existe.',
  };
}

class UpdateCustomerTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({}, [rules.exists({ table: 'customer_tickets', column: 'id' })]),
        ticket_id: schema.string.optional({}, [rules.exists({ table: 'tickets', column: 'id' })]),
        current_owner_id: schema.string.optional({}, [rules.exists({ table: 'people', column: 'id' })]),
        previous_owner_id: schema.string.optional({}, [rules.exists({ table: 'people', column: 'id' })]),
        status_id: schema.string.optional({}, [rules.exists({ table: 'statuses', column: 'id' })]),
        payment_id: schema.string.optional({}, [rules.exists({ table: 'payments', column: 'id' })]),
        validated: schema.boolean.optional(),
        validated_by: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
        validated_at: schema.string.optional(),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O ticket especificado não existe.',
    'data.*.ticket_id.exists': 'O ticket especificado não existe.',
    'data.*.current_owner_id.exists': 'O proprietário atual especificado não existe.',
    'data.*.previous_owner_id.exists': 'O proprietário anterior especificado não existe.',
    'data.*.status_id.exists': 'O status especificado não existe.',
    'data.*.payment_id.exists': 'O pagamento especificado não existe.',
    'data.*.validated.boolean': 'O campo "validated" deve ser um valor booleano.',
    'data.*.validated_by.exists': 'O usuário de validação especificado não existe.',
  };
}

export { CreateCustomerTicketValidator, UpdateCustomerTicketValidator };
