import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventCheckoutFieldTicketValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_checkout_field_id: schema.string({ trim: true }, [
      rules.exists({ table: 'event_checkout_fields', column: 'id' }),
      rules.unique({
        table: 'event_checkout_fields_tickets',
        column: 'event_checkout_field_id',
        where: {
          ticket_id: this.context.request.input('ticket_id'),
          deleted_at: null,
        },
      }),
    ]),
    ticket_id: schema.string({ trim: true }, [rules.exists({ table: 'tickets', column: 'id' })]),
  });

  public messages = {
    'event_checkout_field_id.required': 'O campo "event_checkout_field_id" é obrigatório.',
    'event_checkout_field_id.exists': 'O "event_checkout_field_id" fornecido não existe.',
    'event_checkout_field_id.unique': 'Essa combinação de "event_checkout_field_id" e "ticket_id" já existe.',
    'ticket_id.required': 'O campo "ticket_id" é obrigatório.',
    'ticket_id.exists': 'O "ticket_id" fornecido não existe.',
  };
}

export { CreateEventCheckoutFieldTicketValidator };
