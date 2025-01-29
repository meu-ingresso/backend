import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventGuestValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
    first_name: schema.string({ trim: true }),
    last_name: schema.string.optional({ trim: true }),
    quantity: schema.number([rules.range(1, 100)]),
    guest_by: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
    validated: schema.boolean.optional(),
    validated_by: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
    validated_at: schema.date.optional(),
  });

  public messages = {
    'event_id.required': 'O campo "event_id" é obrigatório.',
    'event_id.exists': 'O evento especificado não existe.',
    'first_name.required': 'O campo "first_name" é obrigatório.',
    'quantity.required': 'O campo "quantity" é obrigatório.',
    'quantity.range': 'A quantidade deve estar entre 1 e 10.',
    'guest_by.required': 'O campo "guest_by" é obrigatório.',
    'guest_by.exists': 'O usuário que adicionou o convidado não existe.',
    'validated_by.exists': 'O validador especificado não existe.',
  };
}

class UpdateEventGuestValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({}, [rules.exists({ table: 'event_guests', column: 'id' })]),
    event_id: schema.string.optional({}, [rules.exists({ table: 'events', column: 'id' })]),
    first_name: schema.string.optional({ trim: true }),
    last_name: schema.string.optional({ trim: true }),
    quantity: schema.number.optional([rules.range(1, 10)]),
    guest_by: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
    validated: schema.boolean.optional(),
    validated_by: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
    validated_at: schema.date.optional(),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.exists': 'O convidado especificado não existe.',
    'event_id.exists': 'O evento especificado não existe.',
    'guest_by.exists': 'O usuário que adicionou o convidado não existe.',
    'validated_by.exists': 'O validador especificado não existe.',
  };
}

export { CreateEventGuestValidator, UpdateEventGuestValidator };
