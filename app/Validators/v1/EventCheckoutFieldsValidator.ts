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
      'TELEFONE',
      'DATA',
      'TEXTO',
      'MENU_DROPDOWN',
      'MULTI_CHECKBOX',
      'TERMO',
      'MESA',
      'ASSENTO',
    ] as const),
    person_type: schema.enum(['PF', 'PJ', 'ESTRANGEIRO'] as const),
    required: schema.boolean(),
    is_unique: schema.boolean(),
    visible_on_ticket: schema.boolean(),
    order: schema.number(),
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
    'order.number': 'O campo "order" precisa ser um número válido.',
    'order.required': 'O campo "order" é obrigatório.',
  };
}

class UpdateEventCheckoutFieldValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }, [rules.exists({ table: 'event_checkout_fields', column: 'id' })]),
    event_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
    name: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
    type: schema.enum.optional([
      'CPF',
      'CNPJ',
      'TELEFONE',
      'DATA',
      'TEXTO',
      'MENU_DROPDOWN',
      'MULTI_CHECKBOX',
      'TERMO',
      'MESA',
      'ASSENTO',
    ] as const),
    required: schema.boolean.optional(),
    is_unique: schema.boolean.optional(),
    visible_on_ticket: schema.boolean.optional(),
    help_text: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
    order: schema.number.optional(),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.exists': 'O "id" fornecido não existe na tabela de campos de checkout.',
    'name.maxLength': 'O campo "name" deve ter no máximo 50 caracteres.',
    'type.enum': 'O campo "type" deve ser um dos valores válidos.',
    'help_text.maxLength': 'O campo "help_text" deve ter no máximo 255 caracteres.',
    'order.number': 'O campo "order" precisa ser um número válido.',
  };
}

export { CreateEventCheckoutFieldValidator, UpdateEventCheckoutFieldValidator };
