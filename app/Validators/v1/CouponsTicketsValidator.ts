import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateCouponTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    coupon_id: schema.string({ trim: true }, [
      rules.exists({ table: 'coupons', column: 'id' }),
      rules.unique({
        table: 'coupons_tickets',
        column: 'coupon_id',
        where: {
          ticket_id: this.context.request.input('ticket_id'),
          deleted_at: null,
        },
      }),
    ]),
    ticket_id: schema.string({ trim: true }, [rules.exists({ table: 'tickets', column: 'id' })]),
  });

  public messages = {
    'coupon_id.required': 'O campo "coupon_id" é obrigatório.',
    'coupon_id.exists': 'O "coupon_id" fornecido não existe.',
    'coupon_id.unique': 'Essa combinação de "coupon_id" e "ticket_id" já existe.',
    'ticket_id.required': 'O campo "ticket_id" é obrigatório.',
    'ticket_id.exists': 'O "ticket_id" fornecido não existe.',
  };
}

export { CreateCouponTicketValidator };
