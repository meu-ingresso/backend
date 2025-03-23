import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreatePaymentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        user_id: schema.string({}, [rules.exists({ table: 'users', column: 'id' })]),
        status_id: schema.string({}, [rules.exists({ table: 'statuses', column: 'id' })]),
        payment_method: schema.string({ trim: true }),
        gross_value: schema.number(),
        net_value: schema.number.optional(),
        coupon_id: schema.string.optional({}, [rules.exists({ table: 'coupons', column: 'id' })]),
        pdv_id: schema.string.optional({}, [rules.exists({ table: 'pdvs', column: 'id' })]),
        paid_at: schema.date.optional(),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.user_id.required': 'O campo "user_id" é obrigatório.',
    'data.*.user_id.exists': 'O usuário especificado não existe.',
    'data.*.status_id.required': 'O campo "status_id" é obrigatório.',
    'data.*.status_id.exists': 'O status especificado não existe.',
    'data.*.payment_method.required': 'O campo "payment_method" é obrigatório.',
    'data.*.payment_method.string': 'O campo "payment_method" deve ser uma string válida.',
    'data.*.gross_value.required': 'O campo "gross_value" é obrigatório.',
    'data.*.gross_value.number': 'O campo "gross_value" deve ser um número válido.',
    'data.*.net_value.number': 'O campo "net_value" deve ser um número válido.',
    'data.*.coupon_id.exists': 'O cupom especificado não existe.',
    'data.*.pdv_id.exists': 'O pdv especificado não existe.',
  };
}

class UpdatePaymentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }, [rules.exists({ table: 'payments', column: 'id' })]),
        user_id: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
        status_id: schema.string.optional({}, [rules.exists({ table: 'statuses', column: 'id' })]),
        payment_method: schema.string.optional({ trim: true }),
        gross_value: schema.number.optional(),
        net_value: schema.number.optional(),
        coupon_id: schema.string.optional({}, [rules.exists({ table: 'coupons', column: 'id' })]),
        pdv_id: schema.string.optional({}, [rules.exists({ table: 'pdvs', column: 'id' })]),
        paid_at: schema.date.optional(),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O pagamento especificado não existe.',
    'data.*.user_id.exists': 'O usuário especificado não existe.',
    'data.*.status_id.exists': 'O status especificado não existe.',
    'data.*.payment_method.string': 'O campo "payment_method" deve ser uma string válida.',
    'data.*.gross_value.number': 'O campo "gross_value" deve ser um número válido.',
    'data.*.net_value.number': 'O campo "net_value" deve ser um número válido.',
    'data.*.coupon_id.exists': 'O cupom especificado não existe.',
    'data.*.pdv_id.exists': 'O pdv especificado não existe.',
  };
}

export { CreatePaymentValidator, UpdatePaymentValidator };
