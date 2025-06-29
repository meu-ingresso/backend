import Database from '@ioc:Adonis/Lucid/Database';
import Tickets from 'App/Models/Access/Tickets';
import Coupons from 'App/Models/Access/Coupons';
import Events from 'App/Models/Access/Events';
import EventFees from 'App/Models/Access/EventFees';
import Payments from 'App/Models/Access/Payments';
import PaymentTickets from 'App/Models/Access/PaymentTickets';
import People from 'App/Models/Access/People';
import TicketReservations from 'App/Models/Access/TicketReservations';

interface TicketItem {
  ticket_id: string;
  quantity: number;
  reservation_id?: string; // Opcional, usado para reservas
  ticket_fields?: {
    field_id: string;
    value: string;
  }[];
}

interface PaymentRequest {
  event_id: string;
  people: {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    tax?: string;
    phone?: string;
    person_type?: string;
    birth_date?: string;
    social_name?: string;
    fantasy_name?: string;
    address_id?: string;
  };
  coupon_id?: string;
  pdv_id?: string;
  description: string;
  transaction_amount: number;
  gross_value: number;
  net_value: number;
  tickets: TicketItem[];
  payment_method?: string;
  status_id?: string;
}

interface TicketCalculation {
  ticket_id: string;
  ticket_name: string;
  quantity: number;
  
  // Valores originais
  original_price: number;
  
  // Aplicação do cupom (antes da taxa)
  coupon_discount_per_ticket: number;
  price_after_coupon: number;
  
  // Aplicação da taxa de serviço
  service_fee_percentage: number | null;
  service_fee_fixed: number | null;
  service_fee_applied: number;
  final_price: number;
  
  // Totais
  total_original_value: number;
  total_coupon_discount: number;
  total_service_fee: number;
  total_final_value: number;
}

interface PaymentCalculation {
  tickets: TicketCalculation[];
  coupon_applied: {
    id: string | null;
    code: string | null;
    discount_type: string | null;
    discount_value: number | null;
  };
  totals: {
    original_value: number;
    total_coupon_discount: number;
    total_service_fee: number;
    final_value: number;
    total_tickets_quantity: number;
  };
}

export default class PaymentCalculationService {
  
  /**
   * Processa um pagamento completo seguindo a lógica:
   * 1. Aplicar desconto do cupom SOBRE o valor original do ingresso
   * 2. Aplicar taxa de serviço:
   *    - Se ingresso < R$ 30: taxa fixa de R$ 3
   *    - Se ingresso >= R$ 30: taxa percentual do evento
   */
  public async processPayment(paymentData: PaymentRequest): Promise<any> {
    return await Database.transaction(async (trx) => {
      try {
        // 1. Buscar ou criar a pessoa
        const people = await this.getOrCreatePeople(paymentData.people, trx);
        
        // 2. Calcular todos os valores
        const calculation = await this.calculatePayment(paymentData);
        
        // 3. Criar o Payment
        const payment = await this.createPayment(paymentData, people.id, calculation, trx);
        
        // 4. Criar os PaymentTickets detalhados
        const paymentTickets = await this.createPaymentTickets(payment.id, calculation, trx);
        
        return {
          payment,
          paymentTickets,
          calculation,
          people
        };
        
      } catch (error) {
        throw new Error(`Erro ao processar pagamento: ${error.message}`);
      }
    });
  }

  /**
   * Calcula todos os valores seguindo a lógica específica
   */
  private async calculatePayment(paymentData: PaymentRequest): Promise<PaymentCalculation> {
    // Buscar dados necessários
    const [event, eventFee, tickets, coupon] = await Promise.all([
      Events.findOrFail(paymentData.event_id),
      EventFees.query().where('event_id', paymentData.event_id).first(),
      this.getTicketsData(paymentData.tickets),
      this.getCouponData(paymentData.coupon_id, paymentData.event_id)
    ]);

    const serviceFeePercentage = eventFee?.platform_fee || 0;
    const ticketCalculations: TicketCalculation[] = [];
    
    let totalOriginal = 0;
    let totalCouponDiscount = 0;
    let totalServiceFee = 0;
    let totalFinal = 0;
    let totalQuantity = 0;

    // Calcular para cada tipo de ticket
    for (const ticketItem of paymentData.tickets) {
      
      const ticket = tickets.find(t => t.id === ticketItem.ticket_id);
      
      if (!ticket) {
        throw new Error(`Ticket ${ticketItem.ticket_id} não encontrado`);
      }

      let originalPrice = ticket.price;
      let ticketQuantity = ticketItem.quantity;

      // Busca a reserva se existir
      if (ticketItem.reservation_id) {
        const reservation = await TicketReservations.query()
          .where('id', ticketItem.reservation_id)
          .where('ticket_id', ticket.id)
          .firstOrFail();

        // Verifica se a reserva está ativa
        if (!reservation) {
          throw new Error(`Reserva ${ticketItem.reservation_id} não está ativa ou não encontrada para o ticket ${ticket.id}`);
        }

        // Se a reserva existir, usa o preço da reserva
        originalPrice = reservation.current_ticket_price;

        // Usa a quantidade da reserva
        ticketQuantity = reservation.quantity; 
      }

      let couponDiscountPerTicket = 0;

      // 1. Aplicar desconto do cupom SOBRE o valor original
      if (coupon) {
        if (coupon.discount_type === 'percentage') {
          couponDiscountPerTicket = (originalPrice * coupon.discount_value) / 100;
        } else if (coupon.discount_type === 'fixed') {
          couponDiscountPerTicket = coupon.discount_value;
        }
      }

      const priceAfterCoupon = Math.max(0, originalPrice - couponDiscountPerTicket);
      
      // 2. Aplicar taxa de serviço
      let serviceFeeApplied = 0;
      let serviceFeePercentageUsed: number | null = null;
      let serviceFeeFixedUsed: number | null = null;

      if (priceAfterCoupon < 30) {
        // Taxa fixa de R$ 3 para ingressos abaixo de R$ 30
        serviceFeeApplied = 3;
        serviceFeeFixedUsed = 3;
      } else {
        // Taxa percentual do evento para ingressos >= R$ 30
        serviceFeeApplied = (priceAfterCoupon * serviceFeePercentage) / 100;
        serviceFeePercentageUsed = serviceFeePercentage;
      }

      const finalPrice = priceAfterCoupon + serviceFeeApplied;

      // Calcular totais para esta linha
      const totalOriginalValue = originalPrice * ticketQuantity;
      const totalCouponDiscountValue = couponDiscountPerTicket * ticketQuantity;
      const totalServiceFeeValue = serviceFeeApplied * ticketQuantity;
      const totalFinalValue = finalPrice * ticketQuantity;

      ticketCalculations.push({
        ticket_id: ticketItem.ticket_id,
        ticket_name: ticket.name,
        quantity: ticketQuantity,
        original_price: originalPrice,
        coupon_discount_per_ticket: couponDiscountPerTicket,
        price_after_coupon: priceAfterCoupon,
        service_fee_percentage: serviceFeePercentageUsed,
        service_fee_fixed: serviceFeeFixedUsed,
        service_fee_applied: serviceFeeApplied,
        final_price: finalPrice,
        total_original_value: totalOriginalValue,
        total_coupon_discount: totalCouponDiscountValue,
        total_service_fee: totalServiceFeeValue,
        total_final_value: totalFinalValue
      });

      // Somar aos totais gerais
      totalOriginal += totalOriginalValue;
      totalCouponDiscount += totalCouponDiscountValue;
      totalServiceFee += totalServiceFeeValue;
      totalFinal += totalFinalValue;
      totalQuantity += ticketItem.quantity;
    }

    return {
      tickets: ticketCalculations,
      coupon_applied: {
        id: coupon?.id || null,
        code: coupon?.code || null,
        discount_type: coupon?.discount_type || null,
        discount_value: coupon?.discount_value || null
      },
      totals: {
        original_value: totalOriginal,
        total_coupon_discount: totalCouponDiscount,
        total_service_fee: totalServiceFee,
        final_value: totalFinal,
        total_tickets_quantity: totalQuantity
      }
    };
  }

  /**
   * Busca dados dos tickets
   */
  private async getTicketsData(ticketItems: TicketItem[]) {
    const ticketIds = ticketItems.map(t => t.ticket_id);
    return await Tickets.query().whereIn('id', ticketIds);
  }

  /**
   * Busca dados do cupom se fornecido
   */
  private async getCouponData(couponId?: string, eventId?: string): Promise<Coupons | null> {
    if (!couponId || !eventId) return null;
    
    return await Coupons.query()
      .where('id', couponId)
      .where('event_id', eventId)
      .first();
  }

  /**
   * Busca ou cria uma pessoa
   */
  private async getOrCreatePeople(peopleData: any, trx: any): Promise<People> {
    if (peopleData.id) {
      return await People.findOrFail(peopleData.id);
    }

    const email = peopleData.email;

    if (email) {
      const existingPeople = await People.query().where('email', email).first();

      if (existingPeople) {
        return existingPeople;
      }
    }
    
    // Criar nova pessoa
    const people = new People();
    people.fill({
      ...peopleData,
      tax: peopleData?.tax || null,
      phone: peopleData?.phone || null,
      person_type: peopleData?.person_type || 'PF',
      birth_date: peopleData?.birth_date || null,
      social_name: peopleData?.social_name || null,
      fantasy_name: peopleData?.fantasy_name || null,
      address_id: peopleData?.address_id || null,
    });

    people.useTransaction(trx);
    await people.save();

    return people;
  }

  /**
   * Cria o registro de Payment
   */
  private async createPayment(
    paymentData: PaymentRequest,
    peopleId: string,
    calculation: PaymentCalculation,
    trx: any
  ): Promise<Payments> {

    const payment = new Payments();
    payment.event_id = paymentData.event_id;
    payment.people_id = peopleId;
    payment.status_id = paymentData.status_id || '';
    payment.payment_method = paymentData.payment_method || 'pending';
    payment.gross_value = calculation.totals.original_value;
    payment.net_value = calculation.totals.final_value;
    payment.coupon_id = calculation.coupon_applied.id;
    payment.pdv_id = paymentData.pdv_id || null;

    payment.useTransaction(trx);
    await payment.save();

    return payment;
  }

  /**
   * Cria os registros de PaymentTickets
   */
  private async createPaymentTickets(
    paymentId: string,
    calculation: PaymentCalculation,
    trx: any
  ): Promise<PaymentTickets[]> {
    const paymentTicketsData: any[] = [];

    for (const ticketCalc of calculation.tickets) {
      paymentTicketsData.push({
        payment_id: paymentId,
        ticket_id: ticketCalc.ticket_id,
        quantity: ticketCalc.quantity,
        ticket_original_price: ticketCalc.original_price,
        coupon_discount_value: ticketCalc.coupon_discount_per_ticket,
        ticket_price_after_coupon: ticketCalc.price_after_coupon,
        service_fee_percentage: ticketCalc.service_fee_percentage,
        service_fee_fixed: ticketCalc.service_fee_fixed,
        service_fee_applied: ticketCalc.service_fee_applied,
        ticket_final_price: ticketCalc.final_price,
        total_original_value: ticketCalc.total_original_value,
        total_coupon_discount: ticketCalc.total_coupon_discount,
        total_service_fee: ticketCalc.total_service_fee,
        total_final_value: ticketCalc.total_final_value
      });
    }

    return await PaymentTickets.createMany(paymentTicketsData, { client: trx });
  }

  /**
   * Método para criar CustomerTickets baseados nos PaymentTickets
   * Chamado após confirmação do pagamento
   */
  public async createCustomerTicketsFromPayment(paymentId: string, statusId: string): Promise<any> {
    return await Database.transaction(async (trx) => {
      // Buscar os PaymentTickets
      const paymentTickets = await PaymentTickets.query()
        .where('payment_id', paymentId)
        .preload('ticket');

      const customerTicketsData: any[] = [];

      // Criar CustomerTickets individuais baseados nos PaymentTickets
      for (const paymentTicket of paymentTickets) {
        for (let i = 0; i < paymentTicket.quantity; i++) {
          customerTicketsData.push({
            ticket_id: paymentTicket.ticket_id,
            current_owner_id: null, // Será definido posteriormente
            status_id: statusId,
            payment_id: paymentId,
            ticket_original_value: paymentTicket.ticket_original_price,
            ticket_discount_value: paymentTicket.coupon_discount_value,
            ticket_total_paid: paymentTicket.ticket_final_price,
            validated: false
          });
        }
      }

      // Criar os CustomerTickets
      const CustomerTickets = (await import('App/Models/Access/CustomerTickets')).default;
      return await CustomerTickets.createMany(customerTicketsData, { client: trx });
    });
  }
} 