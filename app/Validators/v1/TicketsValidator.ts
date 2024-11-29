import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
    ticket_event_category_id: schema.string({ trim: true }, [
      rules.exists({ table: 'ticket_event_categories', column: 'id' }),
    ]),
    name: schema.string({ trim: true }),
    description: schema.string.optional({ trim: true }),
    total_quantity: schema.number(),
    remaining_quantity: schema.number(),
    price: schema.number(),
    status_id: schema.string({ trim: true }, [rules.exists({ table: 'statuses', column: 'id' })]),
    start_date: schema.date(),
    end_date: schema.date(),
    availability: schema.enum(['Privado', 'Publico', 'PDV']),
    min_quantity_per_user: schema.number.optional(),
    max_quantity_per_user: schema.number.optional(),
    is_active: schema.boolean.optional(),
  });

  public messages = {
    'event_id.required': 'O campo "event_id" é obrigatório.',
    'event_id.exists': 'O evento especificado não existe.',
    'name.required': 'O campo "name" é obrigatório.',
    'description.string': 'O campo "description" precisa ser uma string válida.',
    'total_quantity.required': 'A quantidade total é obrigatória.',
    'total_quantity.number': 'A quantidade total deve ser um número.',
    'remaining_quantity.required': 'A quantidade restante é obrigatória.',
    'remaining_quantity.number': 'A quantidade restante deve ser um número.',
    'price.required': 'O campo "price" é obrigatório.',
    'price.number': 'O preço deve ser um número.',
    'status_id.required': 'O campo "status_id" é obrigatório.',
    'status_id.exists': 'O status especificado não existe.',
    'start_date.date': 'A data de início deve ser uma data válida.',
    'end_date.date': 'A data de fim deve ser uma data válida.',
    'availability.enum': 'O campo "availability" deve ser Privado, Público ou PDV.',
    'min_quantity_per_user.number': 'O min_quantity_per_user precisa ser um número válido.',
    'max_quantity_per_user.number': 'O min_quantity_per_user precisa ser um número válido.',
    'is_active.required': 'O campo de estado ativo/inativo é obrigatório.',
    'is_active.boolean': 'O estado ativo/inativo deve ser um valor booleano.',
  };
}

class UpdateTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }),
    event_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
    ticket_event_category_id: schema.string.optional({ trim: true }, [
      rules.exists({ table: 'ticket_event_categories', column: 'id' }),
    ]),
    name: schema.string.optional({ trim: true }),
    description: schema.string.optional({ trim: true }),
    tier: schema.number.optional(),
    total_quantity: schema.number.optional(),
    remaining_quantity: schema.number.optional(),
    price: schema.number.optional(),
    status_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'statuses', column: 'id' })]),
    start_date: schema.date.optional(),
    end_date: schema.date.optional(),
    availability: schema.enum.optional(['Privado', 'Publico', 'PDV']),
    min_quantity_per_user: schema.number.optional(),
    max_quantity_per_user: schema.number.optional(),
    is_active: schema.boolean.optional(),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'name.string': 'O campo "name" deve ser uma string válida.',
    'event_id.exists': 'O evento especificado não existe.',
    'start_date.date': 'A data de início deve ser uma data válida.',
    'end_date.date': 'A data de fim deve ser uma data válida.',
    'availability.enum': 'O campo "availability" deve ser Privado, Público ou PDV.',
    'min_quantity_per_user.number': 'O min_quantity_per_user precisa ser um número válido.',
    'max_quantity_per_user.number': 'O min_quantity_per_user precisa ser um número válido.',
    'total_quantity.number': 'A quantidade total deve ser um número.',
    'remaining_quantity.number': 'A quantidade restante deve ser um número.',
    'price.number': 'O preço deve ser um número.',
    'is_active.boolean': 'O estado ativo/inativo deve ser um valor booleano.',
  };
}

export { CreateTicketValidator, UpdateTicketValidator };
