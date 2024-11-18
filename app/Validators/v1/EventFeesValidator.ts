import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventFeeValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
    platform_fee: schema.number(),
    promoter_fee: schema.number(),
    fixed_fee: schema.number.optional(),
    variable_fee: schema.number.optional(),
  });

  public messages = {
    'event_id.required': 'O campo event_id é obrigatório.',
    'event_id.exists': 'O evento especificado não existe.',
    'platform_fee.required': 'A taxa da plataforma (platform_fee) é obrigatória.',
    'promoter_fee.required': 'A taxa do promotor (promoter_fee) é obrigatória.',
    'platform_fee.number': 'A taxa da plataforma deve ser um número.',
    'promoter_fee.number': 'A taxa do promotor deve ser um número.',
    'fixed_fee.number': 'A taxa fixa (fixed_fee) deve ser um número.',
    'variable_fee.number': 'A taxa variável (variable_fee) deve ser um número.',
  };
}

class UpdateEventFeeValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    event_id: schema.string.optional({}, [rules.exists({ table: 'events', column: 'id' })]),
    platform_fee: schema.number.optional(),
    promoter_fee: schema.number.optional(),
    fixed_fee: schema.number.optional(),
    variable_fee: schema.number.optional(),
  });

  public messages = {
    'id.required': 'O campo id é obrigatório.',
    'event_id.exists': 'O evento especificado não existe.',
    'platform_fee.number': 'A taxa da plataforma deve ser um número.',
    'promoter_fee.number': 'A taxa do promotor deve ser um número.',
    'fixed_fee.number': 'A taxa fixa (fixed_fee) deve ser um número.',
    'variable_fee.number': 'A taxa variável (variable_fee) deve ser um número.',
  };
}

export { CreateEventFeeValidator, UpdateEventFeeValidator };
