import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        event_id: schema.string({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
        ticket_event_category_id: schema.string.optional({ trim: true }, [
          rules.exists({ table: 'ticket_event_categories', column: 'id' }),
        ]),
        name: schema.string({ trim: true }),
        description: schema.string.optional({ trim: true }),
        total_quantity: schema.number(),
        total_sold: schema.number.optional(),
        price: schema.number(),
        status_id: schema.string({ trim: true }, [rules.exists({ table: 'statuses', column: 'id' })]),
        start_date: schema.date(),
        end_date: schema.date(),
        availability: schema.enum(['Privado', 'Publico', 'PDV']),
        display_order: schema.number(),
        min_quantity_per_user: schema.number.optional(),
        max_quantity_per_user: schema.number.optional(),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.event_id.required': 'O campo "event_id" é obrigatório.',
    'data.*.event_id.exists': 'O evento especificado não existe.',
    'data.*.ticket_event_category_id.exists': 'A categoria de ticket especificado não existe.',
    'data.*.name.required': 'O campo "name" é obrigatório.',
    'data.*.description.string': 'O campo "description" precisa ser uma string válida.',
    'data.*.total_quantity.required': 'A quantidade total é obrigatória.',
    'data.*.total_quantity.number': 'A quantidade total deve ser um número.',
    'data.*.total_sold.number': 'A quantidade vendida deve ser um número.',
    'data.*.price.required': 'O campo "price" é obrigatório.',
    'data.*.price.number': 'O preço deve ser um número.',
    'data.*.status_id.required': 'O campo "status_id" é obrigatório.',
    'data.*.status_id.exists': 'O status especificado não existe.',
    'data.*.start_date.date': 'A data de início deve ser uma data válida.',
    'data.*.end_date.date': 'A data de fim deve ser uma data válida.',
    'data.*.availability.enum': 'O campo "availability" deve ser Privado, Público ou PDV.',
    'data.*.display_order.required': 'O campo "display_order" é obrigatório.',
    'data.*.display_order.number': 'O campo "display_order" precisa ser um número válido.',
    'data.*.min_quantity_per_user.number': 'O min_quantity_per_user precisa ser um número válido.',
    'data.*.max_quantity_per_user.number': 'O min_quantity_per_user precisa ser um número válido.',
  };
}

class UpdateTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }),
        event_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
        ticket_event_category_id: schema.string.optional({ trim: true }, [
          rules.exists({ table: 'ticket_event_categories', column: 'id' }),
        ]),
        name: schema.string.optional({ trim: true }),
        description: schema.string.optional({ trim: true }),
        tier: schema.number.optional(),
        total_quantity: schema.number.optional(),
        total_sold: schema.number.optional(),
        price: schema.number.optional(),
        status_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'statuses', column: 'id' })]),
        start_date: schema.date.optional(),
        end_date: schema.date.optional(),
        availability: schema.enum.optional(['Privado', 'Publico', 'PDV']),
        display_order: schema.number.optional(),
        min_quantity_per_user: schema.number.optional(),
        max_quantity_per_user: schema.number.optional(),
      })
    ),
  });

  public messages = {
    'tickets.required': 'O array de tickets é obrigatório.',
    'tickets.array': 'O campo tickets deve ser um array.',
    'tickets.*.id.required': 'O campo "id" é obrigatório para todos os tickets.',
    'tickets.*.name.string': 'O campo "name" deve ser uma string válida.',
    'tickets.*.event_id.exists': 'O campo "event_id" especificado não existe.',
    'tickets.*.ticket_event_category_id.exists': 'A categoria de ticket especificado não existe.',
    'tickets.*.start_date.date': 'O campo "start_date" deve ser uma data válida.',
    'tickets.*.end_date.date': 'O campo "end_date" deve ser uma data válida.',
    'tickets.*.availability.enum': 'O campo "availability" deve ser Privado, Público ou PDV.',
    'tickets.*.min_quantity_per_user.number': 'O campo "min_quantity_per_user" precisa ser um número válido.',
    'tickets.*.max_quantity_per_user.number': 'O campo "max_quantity_per_user" precisa ser um número válido.',
    'tickets.*.total_quantity.number': 'O campo "total_quantity" deve ser um número.',
    'tickets.*.total_sold.number': 'O campo "total_sold" deve ser um número.',
    'tickets.*.price.number': 'O campo "price" deve ser um número.',
    'tickets.*.display_order.number': 'O campo "display_order" precisa ser um número válido.',
  };
}

export { CreateTicketValidator, UpdateTicketValidator };
