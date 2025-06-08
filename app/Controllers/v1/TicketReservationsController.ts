import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import TicketReservationService from 'App/Services/v1/TicketReservationService';
import { CreateTicketReservationValidator } from 'App/Validators/v1/TicketReservationValidator';
import utils from 'Utils/utils';
import { DateTime } from 'luxon';

export default class TicketReservationsController {
  private reservationService: TicketReservationService = new TicketReservationService();

  /**
   * Cria uma nova reserva
   */
  public async create(context: HttpContextContract) {
    try {
      const payload = await context.request.validate(CreateTicketReservationValidator);

      const expiresAt =
        typeof payload.expires_time === 'string' ? DateTime.fromISO(payload.expires_time) : payload.expires_time;

      if (expiresAt <= DateTime.now()) {
        return utils.handleError(context, 400, 'INVALID_EXPIRATION', 'O tempo de expiração deve ser no futuro');
      }

      const reservation = await this.reservationService.createReservation({
        ticket_id: payload.ticket_id,
        quantity: payload.quantity,
        expires_time: expiresAt,
      });

      return utils.handleSuccess(context, reservation, 'RESERVATION_CREATED', 201);
    } catch (error: any) {
      return utils.handleError(context, 400, 'RESERVATION_ERROR', error.message);
    }
  }
}
