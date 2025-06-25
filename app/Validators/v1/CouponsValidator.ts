import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateCouponValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
        status_id: schema.string({}, [rules.exists({ table: 'statuses', column: 'id' })]),
        code: schema.string(),
        discount_type: schema.enum(['PERCENTAGE', 'FIXED']),
        discount_value: schema.number(),
        start_date: schema.date.optional(),
        end_date: schema.date.optional(),
        max_uses: schema.number(),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.event_id.required': 'O campo "event_id" é obrigatório.',
    'data.*.event_id.exists': 'O evento especificado não existe.',
    'data.*.status_id.required': 'O campo "status_id" é obrigatório.',
    'data.*.status_id.exists': 'O status especificado não existe.',
    'data.*.code.required': 'O campo "code" é obrigatório.',
    'data.*.code.unique': 'Já existe um cupom com este código para o mesmo evento.',
    'data.*.discount_type.required': 'O campo "discount_type" é obrigatório.',
    'data.*.discount_type.enum': 'O campo "discount_type" deve ser "PERCENTAGE" ou "FIXED".',
    'data.*.discount_value.required': 'O campo "discount_value" é obrigatório.',
    'data.*.discount_value.number': 'O campo "discount_value" deve ser um número válido.',
    'data.*.start_date.date': 'A data de início deve ser uma data válida.',
    'data.*.end_date.date': 'A data de fim deve ser uma data válida.',
    'data.*.max_uses.required': 'O campo "max_uses" é obrigatório.',
    'data.*.max_uses.number': 'O campo "max_uses" deve ser um número válido.',
  };
}

class UpdateCouponValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({}, [rules.exists({ table: 'coupons', column: 'id' })]),
        event_id: schema.string.optional({}, [rules.exists({ table: 'events', column: 'id' })]),
        status_id: schema.string.optional({}, [rules.exists({ table: 'statuses', column: 'id' })]),
        code: schema.string.optional(),
        discount_type: schema.enum.optional(['PERCENTAGE', 'FIXED']),
        discount_value: schema.number.optional(),
        start_date: schema.date.optional(),
        end_date: schema.date.optional(),
        max_uses: schema.number.optional(),
        uses: schema.number.optional(),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O cupom especificado não existe.',
    'data.*.event_id.exists': 'O evento especificado não existe.',
    'data.*.status_id.exists': 'O status especificado não existe.',
    'data.*.code.unique': 'Já existe um cupom com este código para o mesmo evento.',
    'data.*.discount_type.enum': 'O campo "discount_type" deve ser "PERCENTAGE" ou "FIXED".',
    'data.*.start_date.date': 'A data de início deve ser uma data válida.',
    'data.*.end_date.date': 'A data de fim deve ser uma data válida.',
    'data.*.max_uses.number': 'O campo "max_uses" deve ser um número válido.',
    'data.*.uses.number': 'O campo "uses" deve ser um número válido.',
  };
}

class ValidateCouponValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({}, [
      rules.exists({ table: 'events', column: 'id' }),
      rules.uuid({ version: 4 })
    ]),
    code: schema.string({}, [
      rules.trim(),
      rules.minLength(2),
      rules.maxLength(50),
      rules.regex(/^[A-Za-z0-9_-]+$/)
    ]),
  });

  public messages = {
    'event_id.required': 'O campo "event_id" é obrigatório.',
    'event_id.exists': 'O evento especificado não existe.',
    'event_id.uuid': 'O "event_id" deve ser um UUID válido.',
    'code.required': 'O campo "code" é obrigatório.',
    'code.minLength': 'O código deve ter pelo menos 2 caracteres.',
    'code.maxLength': 'O código pode ter no máximo 50 caracteres.',
    'code.regex': 'O código pode conter apenas letras, números, hífen e underscore.',
  };
}

export { CreateCouponValidator, UpdateCouponValidator, ValidateCouponValidator };
