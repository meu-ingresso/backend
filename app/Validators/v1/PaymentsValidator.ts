import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CardPaymentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    user_id: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
    coupon_id: schema.string.optional({}, [rules.exists({ table: 'coupons', column: 'id' })]),
    pdv_id: schema.string.optional({}, [rules.exists({ table: 'pdvs', column: 'id' })]),
    description: schema.string(),
    transaction_amount: schema.number([rules.unsigned()]),
    gross_value: schema.number([rules.unsigned()]),
    net_value: schema.number([rules.unsigned()]),
    token: schema.string(),
    payment_method_id: schema.string(),
    installments: schema.number.optional(),
    payer: schema.object().members({
      email: schema.string({}, [rules.email()]),
      first_name: schema.string.optional(),
      last_name: schema.string.optional(),
      identification: schema.object.optional().members({
        type: schema.string.optional(),
        number: schema.string.optional(),
      }),
    }),
  });

  public messages = {
    'user_id.exists': 'O usuário informado não existe',
    'user_id.string': 'O usuário informado deve ser uma string',
    'coupon_id.exists': 'O cupom informado não existe',
    'coupon_id.string': 'O cupom informado deve ser uma string',
    'pdv_id.exists': 'O pdv informado não existe',
    'pdv_id.string': 'O pdv informado deve ser uma string',
    'description.required': 'A descrição é obrigatória',
    'description.string': 'A descrição deve ser uma string',
    'transaction_amount.unsigned': 'O valor da transação deve ser positivo',
    'transaction_amount.number': 'O valor da transação deve ser um número',
    'gross_value.unsigned': 'O valor bruto da transação deve ser positivo',
    'gross_value.number': 'O valor bruto da transação deve ser um número',
    'net_value.unsigned': 'O valor líquido da transação deve ser positivo',
    'net_value.number': 'O valor líquido da transação deve ser um número',
    'token.required': 'O token é obrigatório',
    'token.string': 'O token deve ser uma string',
    'payment_method_id.required': 'O método de pagamento é obrigatório',
    'payment_method_id.string': 'O método de pagamento deve ser uma string',
    'payer.email.required': 'O e-mail do pagador é obrigatório',
    'payer.email.email': 'O e-mail do pagador deve ser um e-mail válido',
    'installments.unsigned': 'O número de parcelas deve ser um número positivo',
    'installments.range': 'O número de parcelas deve estar entre 1 e 12',
  };
}

class PixPaymentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    user_id: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
    description: schema.string(),
    transaction_amount: schema.number([rules.unsigned()]),
    gross_value: schema.number([rules.unsigned()]),
    net_value: schema.number([rules.unsigned()]),
    payer: schema.object().members({
      email: schema.string({}, [rules.email()]),
      first_name: schema.string.optional(),
      last_name: schema.string.optional(),
      identification: schema.object.optional().members({
        type: schema.string.optional(),
        number: schema.string.optional(),
      }),
    }),
  });

  public messages = {
    'user_id.exists': 'O usuário informado não existe',
    'description.required': 'A descrição é obrigatória',
    'transaction_amount.unsigned': 'O valor da transação deve ser positivo',
    'gross_value.unsigned': 'O valor bruto da transação deve ser positivo',
    'net_value.unsigned': 'O valor líquido da transação deve ser positivo',
    'payer.email.required': 'O e-mail do pagador é obrigatório',
    'payer.email.email': 'O e-mail do pagador deve ser um e-mail válido',
  };
}

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

export { CardPaymentValidator, PixPaymentValidator, CreatePaymentValidator, UpdatePaymentValidator };
