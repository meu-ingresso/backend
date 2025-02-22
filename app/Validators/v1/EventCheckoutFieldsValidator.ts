import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventCheckoutFieldValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
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
  });

  public messages = {
    'event_id.required': 'O campo "event_id" é obrigatório.',
    'event_id.exists': 'O "event_id" fornecido não existe na tabela de eventos.',
    'name.required': 'O campo "name" é obrigatório.',
    'name.maxLength': 'O campo "name" deve ter no máximo 50 caracteres.',
    'type.required': 'O campo "type" é obrigatório.',
    'type.enum': 'O campo "type" deve ser um dos valores válidos.',
    'help_text.maxLength': 'O campo "help_text" deve ter no máximo 255 caracteres.',
    'display_order.number': 'O campo "display_order" precisa ser um número válido.',
    'display_order.required': 'O campo "display_order" é obrigatório.',
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
    'event_checkout_fields.required': 'O campo "event_checkout_fields" é obrigatório.',
    'event_checkout_fields.array': 'O campo "event_checkout_fields" deve ser um array.',
    'event_checkout_fields.*.id.required': 'O campo "id" é obrigatório.',
    'event_checkout_fields.*.id.exists': 'O "id" fornecido não existe na tabela de campos de checkout.',
    'event_checkout_fields.*.name.maxLength': 'O campo "name" deve ter no máximo 50 caracteres.',
    'event_checkout_fields.*.type.enum': 'O campo "type" deve ser um dos valores válidos.',
    'event_checkout_fields.*.help_text.maxLength': 'O campo "help_text" deve ter no máximo 255 caracteres.',
    'event_checkout_fields.*.display_order.number': 'O campo "display_order" precisa ser um número válido.',
  };
}

export { CreateEventCheckoutFieldValidator, UpdateEventCheckoutFieldValidator };
