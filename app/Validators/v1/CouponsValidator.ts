import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateCouponValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
    status_id: schema.string({}, [rules.exists({ table: 'statuses', column: 'id' })]),
    code: schema.string({}, [
      rules.unique({
        table: 'coupons',
        column: 'code',
        where: {
          event_id: this.context.request.input('event_id'),
          deleted_at: null,
        },
      }),
    ]),
    discount_type: schema.enum(['PERCENTAGE', 'FIXED']),
    discount_value: schema.number(),
    start_date: schema.date.optional(),
    end_date: schema.date.optional(),
    max_uses: schema.number(),
  });

  public messages = {
    'event_id.required': 'O campo "event_id" é obrigatório.',
    'event_id.exists': 'O evento especificado não existe.',
    'status_id.required': 'O campo "status_id" é obrigatório.',
    'status_id.exists': 'O status especificado não existe.',
    'code.required': 'O campo "code" é obrigatório.',
    'code.unique': 'Já existe um cupom com este código para o mesmo evento.',
    'discount_type.required': 'O campo "discount_type" é obrigatório.',
    'discount_type.enum': 'O campo "discount_type" deve ser "PERCENTAGE" ou "FIXED".',
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
    status_id: schema.string.optional({}, [rules.exists({ table: 'statuses', column: 'id' })]),
    code: schema.string.optional({}, [
      rules.unique({
        table: 'coupons',
        column: 'code',
        whereNot: { id: this.context.request.input('id') },
        where: {
          event_id: this.context.request.input('event_id'),
          deleted_at: null,
        },
      }),
    ]),
    discount_type: schema.enum.optional(['percentage', 'fixed']),
    discount_value: schema.number.optional(),
    start_date: schema.date.optional(),
    end_date: schema.date.optional(),
    max_uses: schema.number.optional(),
    uses: schema.number.optional(),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.exists': 'O cupom especificado não existe.',
    'event_id.exists': 'O evento especificado não existe.',
    'status_id.exists': 'O status especificado não existe.',
    'code.unique': 'Já existe um cupom com este código para o mesmo evento.',
    'discount_type.enum': 'O campo "discount_type" deve ser "PERCENTAGE" ou "FIXED".',
    'start_date.date': 'A data de início deve ser uma data válida.',
    'end_date.date': 'A data de fim deve ser uma data válida.',
    'max_uses.number': 'O campo "max_uses" deve ser um número válido.',
    'uses.number': 'O campo "uses" deve ser um número válido.',
  };
}

export { CreateCouponValidator, UpdateCouponValidator };
