import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateCouponValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
    code: schema.string({}, [
      rules.unique({
        table: 'coupons',
        column: 'code',
        where: { event_id: this.context.request.input('event_id') },
      }),
    ]),
    discount_type: schema.enum(['percentage', 'fixed']),
    discount_value: schema.number(),
    start_date: schema.date.optional(),
    end_date: schema.date.optional(),
    max_uses: schema.number(),
  });

  public messages = {
    'event_id.required': 'O campo "event_id" é obrigatório.',
    'event_id.exists': 'O evento especificado não existe.',
    'code.required': 'O campo "code" é obrigatório.',
    'code.unique': 'Já existe um cupom com este código para o mesmo evento.',
    'discount_type.required': 'O campo "discount_type" é obrigatório.',
    'discount_type.enum': 'O campo "discount_type" deve ser "percentage" ou "fixed".',
    'discount_value.required': 'O campo "discount_value" é obrigatório.',
    'discount_value.number': 'O campo "discount_value" deve ser um número válido.',
    'start_date.date': 'A data de início deve ser uma data válida.',
    'end_date.date': 'A data de fim deve ser uma data válida.',
    'max_uses.required': 'O campo "max_uses" é obrigatório.',
    'max_uses.number': 'O campo "max_uses" deve ser um número válido.',
  };
}

class UpdateCouponValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({}, [rules.exists({ table: 'coupons', column: 'id' })]),
    event_id: schema.string.optional({}, [rules.exists({ table: 'events', column: 'id' })]),
    code: schema.string.optional({}, [
      rules.unique({
        table: 'coupons',
        column: 'code',
        where: { event_id: this.context.request.input('event_id') },
        whereNot: { id: this.context.request.input('id') },
      }),
    ]),
    discount_type: schema.enum.optional(['percentage', 'fixed']),
    discount_value: schema.number.optional(),
    start_date: schema.date.optional(),
    end_date: schema.date.optional(),
    max_uses: schema.number.optional(),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.exists': 'O cupom especificado não existe.',
    'event_id.exists': 'O evento especificado não existe.',
    'code.unique': 'Já existe um cupom com este código para o mesmo evento.',
    'discount_type.enum': 'O campo "discount_type" deve ser "percentage" ou "fixed".',
    'start_date.date': 'A data de início deve ser uma data válida.',
    'end_date.date': 'A data de fim deve ser uma data válida.',
  };
}

export { CreateCouponValidator, UpdateCouponValidator };
