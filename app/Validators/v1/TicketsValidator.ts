import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
    name: schema.string(),
    tier: schema.number(),
    total_quantity: schema.number(),
    remaining_quantity: schema.number(),
    price: schema.number(),
    is_active: schema.boolean(),
  });

  public messages = {
    'event_id.required': 'O campo event_id é obrigatório.',
    'event_id.exists': 'O evento especificado não existe.',
    'name.required': 'O campo nome é obrigatório.',
    'tier.required': 'O nível (tier) é obrigatório.',
    'tier.number': 'O nível (tier) deve ser um número.',
    'total_quantity.required': 'A quantidade total é obrigatória.',
    'total_quantity.number': 'A quantidade total deve ser um número.',
    'remaining_quantity.required': 'A quantidade restante é obrigatória.',
    'remaining_quantity.number': 'A quantidade restante deve ser um número.',
    'price.required': 'O preço é obrigatório.',
    'price.number': 'O preço deve ser um número.',
    'is_active.required': 'O campo de estado ativo/inativo é obrigatório.',
    'is_active.boolean': 'O estado ativo/inativo deve ser um valor booleano.',
  };
}

class UpdateTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    event_id: schema.string.optional({}, [rules.exists({ table: 'events', column: 'id' })]),
    name: schema.string.optional(),
    tier: schema.number.optional(),
    total_quantity: schema.number.optional(),
    remaining_quantity: schema.number.optional(),
    price: schema.number.optional(),
    is_active: schema.boolean.optional(),
  });

  public messages = {
    'id.required': 'O campo id é obrigatório.',
    'event_id.exists': 'O evento especificado não existe.',
    'tier.number': 'O nível (tier) deve ser um número.',
    'total_quantity.number': 'A quantidade total deve ser um número.',
    'remaining_quantity.number': 'A quantidade restante deve ser um número.',
    'price.number': 'O preço deve ser um número.',
    'is_active.boolean': 'O estado ativo/inativo deve ser um valor booleano.',
  };
}

export { CreateTicketValidator, UpdateTicketValidator };
