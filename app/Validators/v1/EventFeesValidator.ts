import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventFeeValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
    platform_fee: schema.number(),
    promoter_fee: schema.number(),
    fixed_fee: schema.number.optional(),
    variable_fee: schema.number.optional(),
  });

  public messages = {
    'event_id.required': 'O campo "event_id" é obrigatório.',
    'event_id.exists': 'O evento especificado não foi encontrado.',
    'platform_fee.required': 'O campo "platform_fee" é obrigatório.',
    'platform_fee.number': 'O campo "platform_fee" deve ser um número.',
    'promoter_fee.required': 'O campo "promoter_fee" é obrigatório.',
    'promoter_fee.number': 'O campo "promoter_fee" deve ser um número.',
    'fixed_fee.number': 'O campo "fixed_fee" deve ser um número.',
    'variable_fee.number': 'O campo "variable_fee" deve ser um número.',
  };
}

class UpdateEventFeeValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }),
    event_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
    platform_fee: schema.number.optional(),
    promoter_fee: schema.number.optional(),
    fixed_fee: schema.number.optional(),
    variable_fee: schema.number.optional(),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.string': 'O campo "id" deve ser uma string válida.',
    'event_id.exists': 'O evento especificado não foi encontrado.',
    'platform_fee.number': 'O campo "platform_fee" deve ser um número.',
    'promoter_fee.number': 'O campo "promoter_fee" deve ser um número.',
    'fixed_fee.number': 'O campo "fixed_fee" deve ser um número.',
    'variable_fee.number': 'O campo "variable_fee" deve ser um número.',
  };
}

export { CreateEventFeeValidator, UpdateEventFeeValidator };
