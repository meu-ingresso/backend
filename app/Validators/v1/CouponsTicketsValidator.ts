import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateCouponTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        coupon_id: schema.string({ trim: true }, [rules.exists({ table: 'coupons', column: 'id' })]),
        ticket_id: schema.string({ trim: true }, [rules.exists({ table: 'tickets', column: 'id' })]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.coupon_id.required': 'O campo "coupon_id" é obrigatório.',
    'data.*.coupon_id.exists': 'O "coupon_id" fornecido não existe.',
    'data.*.ticket_id.required': 'O campo "ticket_id" é obrigatório.',
    'data.*.ticket_id.exists': 'O "ticket_id" fornecido não existe.',
  };
}

export { CreateCouponTicketValidator };
