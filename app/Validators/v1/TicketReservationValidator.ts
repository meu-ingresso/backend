import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateTicketReservationValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    ticket_id: schema.string({ trim: true }),
    quantity: schema.number(),
    expires_time: schema.date(),
  });

  public messages = {
    'ticket_id.required': 'O campo "ticket_id" é obrigatório.',
    'quantity.required': 'O campo "quantity" é obrigatório.',
    'expires_time.required': 'O campo "expires_time" é obrigatório.',
  };
}

export { CreateTicketReservationValidator };
