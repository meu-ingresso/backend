import Database from '@ioc:Adonis/Lucid/Database';
import { DateTime } from 'luxon';
import Event from 'App/Models/Access/Events';
import Users from 'App/Models/Access/Users';

interface AliasValidationResult {
  alias: string;
  is_valid: boolean;
}

interface EventWithTotalizers extends Event {
  totalizers?: any;
}

interface EventSession {
  start_date: any;
  start_time: string;
  end_date: any;
  end_time: string;
}

export default class EventService {
  public async getTotalizers(event_id: string): Promise<any> {
    const totalizers = await Database.from('customer_tickets')
      .join('tickets', 'customer_tickets.ticket_id', 'tickets.id')
      .join('payments', 'customer_tickets.payment_id', 'payments.id')
      .where('tickets.event_id', event_id)
      .select('payments.net_value as net_value', 'customer_tickets.created_at as created_at');

    const today = DateTime.now().startOf('day');

    const totalViews = await Database.from('event_views').where('event_id', event_id).count('* as total');

    let total = {
      totalSales: 0,
      totalSalesToday: 0,
      totalSalesAmount: 0,
      totalSalesAmountToday: 0,
      totalViews: Number(totalViews[0].total),
    };

    for (const totalizer of totalizers) {
      total.totalSales += 1;
      total.totalSalesAmount += Number(totalizer.net_value);

      const createdAt = DateTime.fromJSDate(totalizer.created_at).startOf('day');

      if (createdAt.equals(today)) {
        total.totalSalesToday += 1;
        total.totalSalesAmountToday += Number(totalizer.net_value);
      }
    }

    return total;
  }

  public async validateAlias(alias: string): Promise<AliasValidationResult> {
    const events = await Database.from('events').where('alias', alias);

    if (!events || events.length === 0) {
      return { alias, is_valid: true };
    }

    const now = DateTime.now();
    const currentDateOnly = now.startOf('day');

    for (const event of events) {
      const eventEndDateOnly = DateTime.fromISO(event.end_date).startOf('day');

      const isEventFinished = eventEndDateOnly < currentDateOnly || eventEndDateOnly.equals(currentDateOnly);

      if (!isEventFinished) {
        return { alias, is_valid: false };
      }
    }

    return { alias, is_valid: true };
  }

  public async getEventByIdWithAllPreloads(event_id: string): Promise<any> {
    return Event.query()
      .where('id', event_id)
      .whereNull('deleted_at')
      .preload('tickets')
      .preload('attachments')
      .preload('collaborators')
      .preload('coupons')
      .preload('checkoutFields')
      .preload('guestLists')
      .first();
  }

  public async getByPromoterAlias(alias: string): Promise<any> {

    const promoter = await Users.query()
      .where('alias', alias)
      .whereNull('deleted_at')
      .preload('people')
      .preload('attachments')
      .preload('role')
      .first();

    if (!promoter) {
      return null;
    }

    // Verifica se o papel do usuário é de promotor
    const role = promoter.role;

    if (!role || !['Produtor', 'Admin'].includes(role.name)) {
      return null;
    }

    const events = await Event.query()
      .where('promoter_id', promoter.id)
      .whereNull('deleted_at')
      .whereHas('status', (query) => {
        query.where('name', 'Publicado');
      })
      .preload('status')
      .preload('category')
      .preload('rating')
      .preload('address')
      .preload('tickets', (query) => {
        query.whereNull('deleted_at')
      })
      .preload('attachments', (query) => {
        query.whereNull('deleted_at')
          .orderBy('created_at', 'desc');
      })
      .preload('views')
      .preload('fees')
      .preload('groups')
      .orderBy('start_date', 'desc');

    // Adiciona os totalizadores para cada evento
    if (events && events.length > 0) {
      for (let i = 0; i < events.length; i++) {
        const totalizer = await this.getTotalizers(events[i].id);
        (events[i] as EventWithTotalizers).totalizers = totalizer;
      }
    }

    const profileImage = promoter.attachments?.find((attachment) => attachment.name === 'profile_image' && attachment.value) ?? '';
    const biography = promoter.attachments?.find((attachment) => attachment.name === 'biography' && attachment.value) ?? '';

    return {
      promoter: {
        ...promoter.$attributes,
        avatar: profileImage,
        biography: biography,
      },
      events: events || [],
    };
  }

  public async createSessions(eventUuid: string, sessions: EventSession[]): Promise<any> {
    try {
      // Buscar evento original
      const originalEventResult = await Database.from('events')
        .where('uuid', eventUuid)
        .whereNull('deleted_at')
        .first();
      
      if (!originalEventResult) {
        throw new Error('EVENT_NOT_FOUND');
      }
      
      // Buscar o grupo do evento original
      const groupRelation = await Database.from('event_group_relations')
        .where('event_id', originalEventResult.id)
        .first();
      
      const group_id = groupRelation?.group_id;
      if (!group_id) {
        throw new Error('ORIGINAL_EVENT_HAS_NO_GROUP');
      }
      
      // Iniciar transação para garantir consistência
      const createdSessions = await Database.transaction(async () => {
        const results: any[] = [];
        
        // Processar cada sessão
        for (const session of sessions) {
          // Verificar se já existe um evento do mesmo promoter com a mesma data/hora
          const existingEvent = await Database.from('events')
            .where('promoter_id', originalEventResult.promoter_id)
            .where('start_date', session.start_date.toFormat('yyyy-MM-dd'))
            .where('start_time', session.start_time)
            .where('end_date', session.end_date.toFormat('yyyy-MM-dd'))
            .where('end_time', session.end_time)
            .whereNull('deleted_at')
            .first();
            
          if (existingEvent) {
            results.push({
              error: `Já existe um evento com as mesmas datas e horários (ID: ${existingEvent.id})`,
              session,
            });
            continue;
          }
          
          // Obter todos os dados do evento original com todos os relacionamentos
          const dynamicService = new (await import('App/Services/v1/DynamicService')).default();
          
          // Criar cópia do evento com novos dados
          const eventData = {
            ...originalEventResult,
            id: undefined,
            uuid: undefined,
            start_date: session.start_date,
            start_time: session.start_time,
            end_date: session.end_date,
            end_time: session.end_time,
            created_at: undefined,
            updated_at: undefined,
          };
          
          // Criar novo evento
          const newEvent = await dynamicService.create('Event', eventData);
          
          // Adicionar a relação com o grupo
          await dynamicService.create('EventGroupRelation', {
            group_id,
            event_id: newEvent.id,
          });
          
          // Criar taxas do evento
          await dynamicService.create('EventFee', {
            event_id: newEvent.id,
            platform_fee: 10, // Usando o mesmo valor padrão do método create
          });
          
          // Copiar ingressos (tickets)
          const originalTickets = await dynamicService.search('Ticket', {
            where: { event_id: { v: originalEventResult.id } },
          });
          
          if (originalTickets?.data?.length) {
            for (const ticket of originalTickets.data) {
              const ticketData = {
                ...ticket,
                id: undefined,
                uuid: undefined,
                event_id: newEvent.id,
                created_at: undefined,
                updated_at: undefined,
              };
              
              await dynamicService.create('Ticket', ticketData);
            }
          }
          
          // Copiar cupons
          const originalCoupons = await dynamicService.search('Coupon', {
            where: { event_id: { v: originalEventResult.id } },
          });
          
          if (originalCoupons?.data?.length) {
            for (const coupon of originalCoupons.data) {
              const couponData = {
                ...coupon,
                id: undefined,
                uuid: undefined,
                event_id: newEvent.id,
                created_at: undefined,
                updated_at: undefined,
              };
              
              const newCoupon = await dynamicService.create('Coupon', couponData);
              
              // Copiar relações entre cupons e tickets
              const originalCouponTickets = await dynamicService.search('CouponTicket', {
                where: { coupon_id: { v: coupon.id } },
              });
              
              if (originalCouponTickets?.data?.length) {
                for (const couponTicket of originalCouponTickets.data) {
                  // Buscar o ticket correspondente no novo evento
                  const ticketRelation = await dynamicService.search('Ticket', {
                    where: { 
                      event_id: { v: newEvent.id },
                      name: { v: couponTicket.ticket_name }, 
                    },
                    limit: 1,
                  });
                  
                  if (ticketRelation?.data?.[0]) {
                    const couponTicketData = {
                      coupon_id: newCoupon.id,
                      ticket_id: ticketRelation.data[0].id,
                      ticket_name: couponTicket.ticket_name,
                    };
                    
                    await dynamicService.create('CouponTicket', couponTicketData);
                  }
                }
              }
            }
          }
          
          // Copiar campos de checkout (EventCheckoutFields)
          const originalCheckoutFields = await dynamicService.search('EventCheckoutField', {
            where: { event_id: { v: originalEventResult.id } },
          });
          
          if (originalCheckoutFields?.data?.length) {
            for (const checkoutField of originalCheckoutFields.data) {
              const checkoutFieldData = {
                ...checkoutField,
                id: undefined,
                uuid: undefined,
                event_id: newEvent.id,
                created_at: undefined,
                updated_at: undefined,
              };
              
              const newCheckoutField = await dynamicService.create('EventCheckoutField', checkoutFieldData);
              
              // Copiar opções dos campos de checkout
              const originalOptions = await dynamicService.search('EventCheckoutFieldOption', {
                where: { field_id: { v: checkoutField.id } },
              });
              
              if (originalOptions?.data?.length) {
                for (const option of originalOptions.data) {
                  const optionData = {
                    ...option,
                    id: undefined,
                    uuid: undefined,
                    field_id: newCheckoutField.id,
                    created_at: undefined,
                    updated_at: undefined,
                  };
                  
                  await dynamicService.create('EventCheckoutFieldOption', optionData);
                }
              }
              
              // Copiar relações de campos com tickets
              const originalFieldsTickets = await dynamicService.search('EventCheckoutFieldsTicket', {
                where: { field_id: { v: checkoutField.id } },
              });
              
              if (originalFieldsTickets?.data?.length) {
                for (const fieldTicket of originalFieldsTickets.data) {
                  // Buscar o ticket correspondente no novo evento
                  const ticketRelation = await dynamicService.search('Ticket', {
                    where: { 
                      event_id: { v: newEvent.id },
                      name: { v: fieldTicket.ticket_name },
                    },
                    limit: 1,
                  });
                  
                  if (ticketRelation?.data?.[0]) {
                    const fieldTicketData = {
                      field_id: newCheckoutField.id,
                      ticket_id: ticketRelation.data[0].id,
                      ticket_name: fieldTicket.ticket_name,
                    };
                    
                    await dynamicService.create('EventCheckoutFieldsTicket', fieldTicketData);
                  }
                }
              }
            }
          }
          
          // Adicionar à lista de sessões criadas
          results.push({
            success: true,
            event: newEvent,
            session,
          });
        }
        
        return results;
      });
      
      return createdSessions;
    } catch (error) {
      throw error;
    }
  }
}
