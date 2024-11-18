import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreatePaymentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    user_id: schema.string({}, [rules.exists({ table: 'users', column: 'id' })]),
    status_id: schema.string({}, [rules.exists({ table: 'statuses', column: 'id' })]),
    payment_method: schema.string(),
    gross_value: schema.number(),
    net_value: schema.number.optional(),
    paid_at: schema.date.optional(),
  });

  public messages = {
    'user_id.required': 'O campo user_id é obrigatório.',
    'user_id.exists': 'O usuário especificado não existe.',
    'status_id.required': 'O campo status_id é obrigatório.',
    'status_id.exists': 'O status especificado não existe.',
    'payment_method.required': 'O campo método de pagamento é obrigatório.',
    'gross_value.required': 'O campo valor bruto é obrigatório.',
    'gross_value.number': 'O valor bruto deve ser um número válido.',
    'net_value.number': 'O valor líquido deve ser um número válido.',
    'paid_at.date': 'A data de pagamento deve ser uma data válida.',
  };
}

class UpdatePaymentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    user_id: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
    status_id: schema.string.optional({}, [rules.exists({ table: 'statuses', column: 'id' })]),
    payment_method: schema.string.optional(),
    gross_value: schema.number.optional(),
    net_value: schema.number.optional(),
    paid_at: schema.date.optional(),
  });

  public messages = {
    'id.required': 'O campo id é obrigatório.',
    'user_id.exists': 'O usuário especificado não existe.',
    'status_id.exists': 'O status especificado não existe.',
    'payment_method.string': 'O método de pagamento deve ser um texto válido.',
    'gross_value.number': 'O valor bruto deve ser um número válido.',
    'net_value.number': 'O valor líquido deve ser um número válido.',
    'paid_at.date': 'A data de pagamento deve ser uma data válida.',
  };
}

export { CreatePaymentValidator, UpdatePaymentValidator };
