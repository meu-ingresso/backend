import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventFeeValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        event_id: schema.string({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
        platform_fee: schema.number(),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.event_id.required': 'O campo "event_id" é obrigatório.',
    'data.*.event_id.exists': 'O evento especificado não foi encontrado.',
    'data.*.platform_fee.required': 'O campo "platform_fee" é obrigatório.',
    'data.*.platform_fee.number': 'O campo "platform_fee" deve ser um número.',
  };
}

class UpdateEventFeeValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }, [rules.exists({ table: 'event_fees', column: 'id' })]),
        event_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
        platform_fee: schema.number.optional(),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O "id" fornecido não existe na tabela de taxas.',
    'data.*.event_id.exists': 'O evento especificado não foi encontrado.',
    'data.*.platform_fee.number': 'O campo "platform_fee" deve ser um número.',
  };
}

export { CreateEventFeeValidator, UpdateEventFeeValidator };
