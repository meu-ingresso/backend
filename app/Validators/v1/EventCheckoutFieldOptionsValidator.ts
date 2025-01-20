import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventCheckoutFieldOptionValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_checkout_field_id: schema.string({ trim: true }, [
      rules.exists({ table: 'event_checkout_fields', column: 'id' }),
    ]),
    name: schema.string({ trim: true }, [rules.required()]),
  });

  public messages = {
    'event_checkout_field_id.required': 'O campo "event_checkout_field_id" é obrigatório.',
    'event_checkout_field_id.exists': 'O "event_checkout_field_id" fornecido não existe.',
    'name.required': 'O campo "name" é obrigatório.',
  };
}

class UpdateEventCheckoutFieldOptionValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }, [rules.required()]),
    name: schema.string({ trim: true }, [rules.required()]),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'name.required': 'O campo "name" é obrigatório.',
  };
}

export { CreateEventCheckoutFieldOptionValidator, UpdateEventCheckoutFieldOptionValidator };
