import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreatePaymentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    user_id: schema.string({}, [rules.exists({ table: 'users', column: 'id' })]),
    status_id: schema.string({}, [rules.exists({ table: 'statuses', column: 'id' })]),
    payment_method: schema.string({ trim: true }),
    gross_value: schema.number(),
    net_value: schema.number.optional(),
    coupon_id: schema.string.optional({}, [rules.exists({ table: 'coupons', column: 'id' })]),
    paid_at: schema.date.optional(),
  });

  public messages = {
    'user_id.required': 'O campo "user_id" é obrigatório.',
    'user_id.exists': 'O usuário especificado não existe.',
    'status_id.required': 'O campo "status_id" é obrigatório.',
    'status_id.exists': 'O status especificado não existe.',
    'payment_method.required': 'O campo "payment_method" é obrigatório.',
    'payment_method.string': 'O campo "payment_method" deve ser uma string válida.',
    'gross_value.required': 'O campo "gross_value" é obrigatório.',
    'gross_value.number': 'O campo "gross_value" deve ser um número válido.',
    'net_value.number': 'O campo "net_value" deve ser um número válido.',
    'coupon_id.exists': 'O cupom especificado não existe.',
  };
}

class UpdatePaymentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({}, [rules.exists({ table: 'payments', column: 'id' })]),
    user_id: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
    status_id: schema.string.optional({}, [rules.exists({ table: 'statuses', column: 'id' })]),
    payment_method: schema.string.optional({ trim: true }),
    gross_value: schema.number.optional(),
    net_value: schema.number.optional(),
    coupon_id: schema.string.optional({}, [rules.exists({ table: 'coupons', column: 'id' })]),
    paid_at: schema.date.optional(),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.exists': 'O pagamento especificado não existe.',
    'user_id.exists': 'O usuário especificado não existe.',
    'status_id.exists': 'O status especificado não existe.',
    'payment_method.string': 'O campo "payment_method" deve ser uma string válida.',
    'gross_value.number': 'O campo "gross_value" deve ser um número válido.',
    'net_value.number': 'O campo "net_value" deve ser um número válido.',
    'coupon_id.exists': 'O cupom especificado não existe.',
  };
}

export { CreatePaymentValidator, UpdatePaymentValidator };
