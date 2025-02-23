import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventCheckoutFieldOptionValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        event_checkout_field_id: schema.string({ trim: true }, [
          rules.exists({ table: 'event_checkout_fields', column: 'id' }),
        ]),
        name: schema.string({ trim: true }, [rules.required()]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.event_checkout_field_id.required': 'O campo "event_checkout_field_id" é obrigatório.',
    'data.*.event_checkout_field_id.exists': 'O "event_checkout_field_id" fornecido não existe.',
    'data.*.name.required': 'O campo "name" é obrigatório.',
  };
}

class UpdateEventCheckoutFieldOptionValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }, [rules.exists({ table: 'event_checkout_field_options', column: 'id' })]),
        event_checkout_field_id: schema.string.optional({ trim: true }, [
          rules.exists({ table: 'event_checkout_fields', column: 'id' }),
        ]),
        name: schema.string.optional({ trim: true }, [rules.required()]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O "id" fornecido não existe na tabela de opções.',
    'data.*.event_checkout_field_id.exists': 'O "event_checkout_field_id" fornecido não existe.',
    'data.*.name.required': 'O campo "name" é obrigatório.',
  };
}

export { CreateEventCheckoutFieldOptionValidator, UpdateEventCheckoutFieldOptionValidator };
