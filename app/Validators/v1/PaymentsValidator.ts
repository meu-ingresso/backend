import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CardPaymentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
    people: schema.object().members({
      id: schema.string.optional({}, [rules.exists({ table: 'people', column: 'id' })]),
      first_name: schema.string.optional(),
      last_name: schema.string.optional(),
      email: schema.string.optional({}, [rules.email()]),
      tax: schema.string.optional(),
      phone: schema.string.optional(),
      person_type: schema.string.optional(),
    }),
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
    // Informações dos tickets para compra
    tickets: schema.array().members(
      schema.object().members({
        ticket_id: schema.string({}, [rules.exists({ table: 'tickets', column: 'id' })]),
        quantity: schema.number([rules.unsigned(), rules.range(1, 100)]),
        ticket_fields: schema.array.optional().members(
          schema.object().members({
            field_id: schema.string({}, [rules.exists({ table: 'event_checkout_fields', column: 'id' })]),
            value: schema.string(),
          })
        ),
      })
    ),
  });

  public messages = {
    'event_id.exists': 'O evento informado não existe',
    'people.id.exists': 'A pessoa informada não existe',
    'people.first_name.string': 'O primeiro nome deve ser uma string',
    'people.last_name.string': 'O último nome deve ser uma string',
    'people.email.email': 'O email deve ser um email válido',
    'people.tax.string': 'O documento deve ser uma string',
    'people.phone.string': 'O telefone deve ser uma string',
    'people.person_type.string': 'O tipo de pessoa deve ser uma string',
    'people.birth_date.string': 'A data de nascimento deve ser uma string',
    'people.address_id.exists': 'O endereço informado não existe',
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
    'tickets.required': 'Os tickets são obrigatórios',
    'tickets.array': 'Os tickets devem ser um array',
    'tickets.*.ticket_id.required': 'O ID do ticket é obrigatório',
    'tickets.*.ticket_id.exists': 'O ticket informado não existe',
    'tickets.*.quantity.required': 'A quantidade é obrigatória',
    'tickets.*.quantity.unsigned': 'A quantidade deve ser um número positivo',
    'tickets.*.quantity.range': 'A quantidade deve estar entre 1 e 100',
    'tickets.*.ticket_fields.array': 'Os campos do ticket devem ser um array',
    'tickets.*.ticket_fields.*.field_id.required': 'O ID do campo é obrigatório',
    'tickets.*.ticket_fields.*.field_id.exists': 'O campo informado não existe',
    'tickets.*.ticket_fields.*.value.required': 'O valor do campo é obrigatório',
  };
}

class PixPaymentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
    people: schema.object().members({
      id: schema.string.optional({}, [rules.exists({ table: 'people', column: 'id' })]),
      first_name: schema.string.optional(),
      last_name: schema.string.optional(),
      email: schema.string.optional({}, [rules.email()]),
      tax: schema.string.optional(),
      phone: schema.string.optional(),
      person_type: schema.string.optional(),
      birth_date: schema.string.optional(),
      social_name: schema.string.optional(),
      fantasy_name: schema.string.optional(),
      address_id: schema.string.optional({}, [rules.exists({ table: 'addresses', column: 'id' })]),
    }),
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
    tickets: schema.array().members(
      schema.object().members({
        ticket_id: schema.string({}, [rules.exists({ table: 'tickets', column: 'id' })]),
        quantity: schema.number([rules.unsigned(), rules.range(1, 100)]),
        ticket_fields: schema.array.optional().members(
          schema.object().members({
            field_id: schema.string({}, [rules.exists({ table: 'event_checkout_fields', column: 'id' })]),
            value: schema.string(),
          })
        ),
      })
    ),
  });

  public messages = {
    'event_id.exists': 'O evento informado não existe',
    'people.id.exists': 'A pessoa informada não existe',
    'people.first_name.string': 'O primeiro nome deve ser uma string',
    'people.last_name.string': 'O último nome deve ser uma string',
    'people.email.email': 'O email deve ser um email válido',
    'people.tax.string': 'O documento deve ser uma string',
    'people.phone.string': 'O telefone deve ser uma string',
    'people.person_type.string': 'O tipo de pessoa deve ser uma string',
    'people.birth_date.string': 'A data de nascimento deve ser uma string',
    'people.address_id.exists': 'O endereço informado não existe',
    'description.required': 'A descrição é obrigatória',
    'transaction_amount.unsigned': 'O valor da transação deve ser positivo',
    'gross_value.unsigned': 'O valor bruto da transação deve ser positivo',
    'net_value.unsigned': 'O valor líquido da transação deve ser positivo',
    'payer.email.required': 'O e-mail do pagador é obrigatório',
    'payer.email.email': 'O e-mail do pagador deve ser um e-mail válido',
    'tickets.required': 'Os tickets são obrigatórios',
    'tickets.array': 'Os tickets devem ser um array',
    'tickets.*.ticket_id.required': 'O ID do ticket é obrigatório',
    'tickets.*.ticket_id.exists': 'O ticket informado não existe',
    'tickets.*.quantity.required': 'A quantidade é obrigatória',
    'tickets.*.quantity.unsigned': 'A quantidade deve ser um número positivo',
    'tickets.*.quantity.range': 'A quantidade deve estar entre 1 e 100',
    'tickets.*.ticket_fields.array': 'Os campos do ticket devem ser um array',
    'tickets.*.ticket_fields.*.field_id.required': 'O ID do campo é obrigatório',
    'tickets.*.ticket_fields.*.field_id.exists': 'O campo informado não existe',
    'tickets.*.ticket_fields.*.value.required': 'O valor do campo é obrigatório',
  };
}

class CreatePaymentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
        people_id: schema.string({}, [rules.exists({ table: 'people', column: 'id' })]),
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
    'event_id.exists': 'O evento informado não existe',
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.people_id.required': 'O campo "people_id" é obrigatório.',
    'data.*.people_id.exists': 'O usuário especificado não existe.',
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
        event_id: schema.string.optional({}, [rules.exists({ table: 'events', column: 'id' })]),
        people_id: schema.string.optional({}, [rules.exists({ table: 'people', column: 'id' })]),
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
    'event_id.exists': 'O evento informado não existe',
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O pagamento especificado não existe.',
    'data.*.people_id.exists': 'O usuário especificado não existe.',
    'data.*.status_id.exists': 'O status especificado não existe.',
    'data.*.payment_method.string': 'O campo "payment_method" deve ser uma string válida.',
    'data.*.gross_value.number': 'O campo "gross_value" deve ser um número válido.',
    'data.*.net_value.number': 'O campo "net_value" deve ser um número válido.',
    'data.*.coupon_id.exists': 'O cupom especificado não existe.',
    'data.*.pdv_id.exists': 'O pdv especificado não existe.',
  };
}

export { CardPaymentValidator, PixPaymentValidator, CreatePaymentValidator, UpdatePaymentValidator };
