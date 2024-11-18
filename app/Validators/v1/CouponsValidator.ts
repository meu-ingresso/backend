import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateCouponValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
    code: schema.string({}, [rules.unique({ table: 'coupons', column: 'code' })]),
    discount_type: schema.enum(['fixed', 'percentage']),
    discount_value: schema.number(),
    max_uses: schema.number(),
  });

  public messages = {
    'event_id.required': 'O campo event_id é obrigatório.',
    'event_id.exists': 'O evento especificado não existe.',
    'code.required': 'O campo código é obrigatório.',
    'code.unique': 'O código fornecido já está em uso.',
    'discount_type.required': 'O tipo de desconto é obrigatório.',
    'discount_type.enum': 'O tipo de desconto deve ser "fixed" ou "percentage".',
    'discount_value.required': 'O valor do desconto é obrigatório.',
    'discount_value.number': 'O valor do desconto deve ser um número.',
    'max_uses.required': 'O número máximo de usos é obrigatório.',
    'max_uses.number': 'O número máximo de usos deve ser um número.',
  };
}

class UpdateCouponValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    event_id: schema.string.optional({}, [rules.exists({ table: 'events', column: 'id' })]),
    code: schema.string.optional({}, [rules.unique({ table: 'coupons', column: 'code' })]),
    discount_type: schema.enum.optional(['fixed', 'percentage']),
    discount_value: schema.number.optional(),
    max_uses: schema.number.optional(),
    uses: schema.number.optional(),
  });

  public messages = {
    'id.required': 'O campo id é obrigatório.',
    'event_id.exists': 'O evento especificado não existe.',
    'code.unique': 'O código fornecido já está em uso.',
    'discount_type.enum': 'O tipo de desconto deve ser "fixed" ou "percentage".',
    'discount_value.number': 'O valor do desconto deve ser um número.',
    'max_uses.number': 'O número máximo de usos deve ser um número.',
    'uses.number': 'O número de utilizações deve ser um número.',
  };
}

export { CreateCouponValidator, UpdateCouponValidator };
