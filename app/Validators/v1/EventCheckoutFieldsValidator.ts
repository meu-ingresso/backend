import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventCheckoutFieldValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        event_id: schema.string({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
        name: schema.string({ trim: true }, [rules.maxLength(50)]),
        type: schema.enum([
          'CPF',
          'CNPJ',
          'EMAIL',
          'TELEFONE',
          'DATA',
          'TEXTO',
          'MENU_DROPDOWN',
          'MULTI_CHECKBOX',
          'TERMO',
          'MESA',
          'ASSENTO',
          'PARAGRAFO',
        ] as const),
        person_type: schema.enum(['PF', 'PJ', 'ESTRANGEIRO'] as const),
        required: schema.boolean(),
        is_unique: schema.boolean(),
        visible_on_ticket: schema.boolean(),
        display_order: schema.number(),
        help_text: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.event_id.required': 'O campo "event_id" é obrigatório.',
    'data.*.event_id.exists': 'O "event_id" fornecido não existe na tabela de eventos.',
    'data.*.name.required': 'O campo "name" é obrigatório.',
    'data.*.name.maxLength': 'O campo "name" deve ter no máximo 50 caracteres.',
    'data.*.type.required': 'O campo "type" é obrigatório.',
    'data.*.type.enum': 'O campo "type" deve ser um dos valores válidos.',
    'data.*.help_text.maxLength': 'O campo "help_text" deve ter no máximo 255 caracteres.',
    'data.*.display_order.number': 'O campo "display_order" precisa ser um número válido.',
    'data.*.display_order.required': 'O campo "display_order" é obrigatório.',
  };
}

class UpdateEventCheckoutFieldValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }, [rules.exists({ table: 'event_checkout_fields', column: 'id' })]),
        event_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
        name: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
        type: schema.enum.optional([
          'CPF',
          'CNPJ',
          'EMAIL',
          'TELEFONE',
          'DATA',
          'TEXTO',
          'MENU_DROPDOWN',
          'MULTI_CHECKBOX',
          'TERMO',
          'MESA',
          'ASSENTO',
          'PARAGRAFO',
        ] as const),
        required: schema.boolean.optional(),
        is_unique: schema.boolean.optional(),
        visible_on_ticket: schema.boolean.optional(),
        help_text: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
        display_order: schema.number.optional(),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O "id" fornecido não existe na tabela de campos de checkout.',
    'data.*.name.maxLength': 'O campo "name" deve ter no máximo 50 caracteres.',
    'data.*.type.enum': 'O campo "type" deve ser um dos valores válidos.',
    'data.*.help_text.maxLength': 'O campo "help_text" deve ter no máximo 255 caracteres.',
    'data.*.display_order.number': 'O campo "display_order" precisa ser um número válido.',
  };
}

export { CreateEventCheckoutFieldValidator, UpdateEventCheckoutFieldValidator };
