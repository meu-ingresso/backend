import Database from '@ioc:Adonis/Lucid/Database';
import { DateTime } from 'luxon';
import Event from 'App/Models/Access/Events';
import Users from 'App/Models/Access/Users';
import EventGroupingService from 'App/Services/v1/EventGroupingService';

interface AliasValidationResult {
  alias: string;
  is_valid: boolean;
}

interface EventWithTotalizers extends Event {
  totalizers?: any;
}

interface EventSession {
  start_date: any;
  end_date: any;
}

interface DuplicateOptions {
  start_date?: any;
  end_date?: any;
  alias?: string;
  addToGroup?: boolean;
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

  public async duplicateEvent(eventId: string, options: DuplicateOptions = {}): Promise<any> {
    try {
      // Buscar evento original
      const originalEventResult = await Database.from('events')
        .where('id', eventId)
        .whereNull('deleted_at')
        .first();
      
      if (!originalEventResult) {
        throw new Error('EVENT_NOT_FOUND');
      }
      
      // Iniciar transação para garantir consistência
      return await Database.transaction(async () => {
        const dynamicService = new (await import('App/Services/v1/DynamicService')).default();
        
        // Obter dados do grupo se necessário
        let group_id = null;
        if (options.addToGroup) {
          const groupRelation = await Database.from('event_group_relations')
            .where('event_id', originalEventResult.id)
            .first();
          
          group_id = groupRelation?.group_id;
        }

        // Criar cópia do evento com novos dados
        const customAlias = options.alias || `${originalEventResult.alias}-copy-${DateTime.now().toFormat('yyyyMMddHHmmss')}`;
        
        const eventData = {
          ...originalEventResult,
          id: undefined,
          created_at: undefined,
          updated_at: undefined,
          alias: customAlias,
          start_date: options.start_date || originalEventResult.start_date,
          end_date: options.end_date || originalEventResult.end_date,
        };
        
        // Criar novo evento
        const newEvent = await dynamicService.create('Event', eventData);
        
        // Adicionar a relação com o grupo se necessário
        if (group_id) {
          await dynamicService.create('EventGroupRelation', {
            group_id,
            event_id: newEvent.id,
          });
        }
        
        // Duplicar todas as entidades relacionadas
        await this._duplicateEventRelatedEntities(originalEventResult.id, newEvent.id, dynamicService);
        
        return newEvent;
      });
    } catch (error) {
      throw error;
    }
  }

  public async createSessions(eventUuid: string, sessions: EventSession[]): Promise<any> {
    try {
      // Buscar evento original
      const originalEventResult = await Database.from('events')
        .where('id', eventUuid)
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

      const groupsOfGroup = await Database.from('event_group_relations')
        .where('group_id', group_id);
      
      // Iniciar transação para garantir consistência
      const createdSessions = await Database.transaction(async () => {
        const results: any[] = [];
        const dynamicService = new (await import('App/Services/v1/DynamicService')).default();
        
        // Processar cada sessão
        for (const [index, session] of sessions.entries()) {
          // Criar cópia do evento com novos dados
          const sessionNum = groupsOfGroup.length + index + 1;
          const eventData = {
            ...originalEventResult,
            id: undefined,
            created_at: undefined,
            updated_at: undefined,
            alias: `${originalEventResult.alias}-${sessionNum}`,
            start_date: session.start_date,
            end_date: session.end_date,
          };
          
          // Criar novo evento
          const newEvent = await dynamicService.create('Event', eventData);
          
          // Adicionar a relação com o grupo
          await dynamicService.create('EventGroupRelation', {
            group_id,
            event_id: newEvent.id,
          });
          
          // Duplicar todas as entidades relacionadas
          await this._duplicateEventRelatedEntities(originalEventResult.id, newEvent.id, dynamicService);
          
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

  // Método privado para duplicar todas as entidades relacionadas a um evento
  private async _duplicateEventRelatedEntities(sourceEventId: string, targetEventId: string, dynamicService: any): Promise<void> {
    // 1. Criar taxas do evento
    await this._duplicateEventFees(sourceEventId, targetEventId, dynamicService);
    
    // 2. Duplicar categorias de ingressos
    const newCategories = await this._duplicateTicketCategories(sourceEventId, targetEventId, dynamicService);
    
    // 3. Duplicar ingressos
    await this._duplicateTickets(sourceEventId, targetEventId, newCategories, dynamicService);
    
    // 4. Duplicar cupons
    await this._duplicateCoupons(sourceEventId, targetEventId, dynamicService);
    
    // 5. Duplicar campos de checkout
    await this._duplicateCheckoutFields(sourceEventId, targetEventId, dynamicService);
  }

  private async _duplicateEventFees(sourceEventId: string, targetEventId: string, dynamicService: any): Promise<void> {
    // Buscar as taxas do evento original
    const originalFees = await dynamicService.search('EventFee', {
      where: { event_id: { v: sourceEventId } },
    });

    if (originalFees?.data?.length) {
      for (const fee of originalFees.data) {
        await dynamicService.create('EventFee', {
          ...fee,
          id: undefined,
          event_id: targetEventId,
          created_at: undefined,
          updated_at: undefined,
        });
      }
    } else {
      // Criar taxa padrão se não existir
      await dynamicService.create('EventFee', {
        event_id: targetEventId,
        platform_fee: 10,
      });
    }
  }

  private async _duplicateTicketCategories(sourceEventId: string, targetEventId: string, dynamicService: any): Promise<any[]> {
    const newCategories: any[] = [];
    
    // Buscar as categorias do evento original
    const originalCategories = await dynamicService.search('TicketEventCategory', {
      where: { event_id: { v: sourceEventId } },
    });

    if (originalCategories?.data?.length) {
      for (const category of originalCategories.data) {
        const categoryData = {
          ...category,
          id: undefined,
          event_id: targetEventId,
          created_at: undefined,
          updated_at: undefined,
        };

        const newCategory = await dynamicService.create('TicketEventCategory', categoryData);
        newCategories.push({
          id: newCategory.id,
          name: category.name,
          originalId: category.id
        });
      }
    }
    
    return newCategories;
  }

  private async _duplicateTickets(sourceEventId: string, targetEventId: string, newCategories: any[], dynamicService: any): Promise<void> {
    // Buscar os ingressos do evento original
    const originalTickets = await dynamicService.search('Ticket', {
      where: { event_id: { v: sourceEventId } },
      preloads: ['category'],
    });

    if (originalTickets?.data?.length) {
      for (const ticket of originalTickets.data) {
        // Encontrar a categoria correspondente no novo evento
        const category = newCategories.find((c) => c.name === ticket.category?.name);

        const ticketData = {
          ...ticket,
          id: undefined,
          event_id: targetEventId,
          ticket_event_category_id: category?.id,
          created_at: undefined,
          updated_at: undefined,
        };
        
        await dynamicService.create('Ticket', ticketData);
      }
    }
  }

  private async _duplicateCoupons(sourceEventId: string, targetEventId: string, dynamicService: any): Promise<void> {
    // Buscar os cupons do evento original
    const originalCoupons = await dynamicService.search('Coupon', {
      where: { event_id: { v: sourceEventId } },
    });
    
    if (originalCoupons?.data?.length) {
      for (const coupon of originalCoupons.data) {
        const couponData = {
          ...coupon,
          id: undefined,
          event_id: targetEventId,
          created_at: undefined,
          updated_at: undefined,
        };
        
        const newCoupon = await dynamicService.create('Coupon', couponData);
        
        // Copiar relações entre cupons e tickets
        await this._duplicateCouponTicketRelations(coupon.id, newCoupon.id, targetEventId, dynamicService);
      }
    }
  }

  private async _duplicateCouponTicketRelations(sourceCouponId: string, targetCouponId: string, targetEventId: string, dynamicService: any): Promise<void> {
    const originalCouponTickets = await dynamicService.search('CouponTicket', {
      where: { coupon_id: { v: sourceCouponId } },
    });
    
    if (originalCouponTickets?.data?.length) {
      for (const couponTicket of originalCouponTickets.data) {
        // Buscar o ticket correspondente no novo evento
        const ticketRelation = await dynamicService.search('Ticket', {
          where: { 
            event_id: { v: targetEventId },
            id: { v: couponTicket.ticket_id }, 
          },
          limit: 1,
        });
        
        if (ticketRelation?.data?.[0]) {
          const couponTicketData = {
            coupon_id: targetCouponId,
            ticket_id: ticketRelation.data[0].id,
          };
          
          await dynamicService.create('CouponTicket', couponTicketData);
        }
      }
    }
  }

  private async _duplicateCheckoutFields(sourceEventId: string, targetEventId: string, dynamicService: any): Promise<void> {
    // Buscar os campos de checkout do evento original
    const originalCheckoutFields = await dynamicService.search('EventCheckoutField', {
      where: { event_id: { v: sourceEventId } },
    });
    
    if (originalCheckoutFields?.data?.length) {
      for (const checkoutField of originalCheckoutFields.data) {
        const checkoutFieldData = {
          ...checkoutField,
          id: undefined,
          event_id: targetEventId,
          created_at: undefined,
          updated_at: undefined,
        };
        
        const newCheckoutField = await dynamicService.create('EventCheckoutField', checkoutFieldData);
        
        // Copiar opções dos campos de checkout
        await this._duplicateCheckoutFieldOptions(checkoutField.id, newCheckoutField.id, dynamicService);
        
        // Copiar relações de campos com tickets
        await this._duplicateCheckoutFieldTicketRelations(checkoutField.id, newCheckoutField.id, targetEventId, dynamicService);
      }
    }
  }

  private async _duplicateCheckoutFieldOptions(sourceFieldId: string, targetFieldId: string, dynamicService: any): Promise<void> {
    const originalOptions = await dynamicService.search('EventCheckoutFieldOption', {
      where: { event_checkout_field_id: { v: sourceFieldId } },
    });
    
    if (originalOptions?.data?.length) {
      for (const option of originalOptions.data) {
        const optionData = {
          ...option,
          id: undefined,
          event_checkout_field_id: targetFieldId,
          created_at: undefined,
          updated_at: undefined,
        };
        
        await dynamicService.create('EventCheckoutFieldOption', optionData);
      }
    }
  }

  private async _duplicateCheckoutFieldTicketRelations(sourceFieldId: string, targetFieldId: string, targetEventId: string, dynamicService: any): Promise<void> {
    // Buscar relações originais
    const originalRelations = await Database.from('event_checkout_fields_tickets')
      .where('event_checkout_field_id', sourceFieldId);

    if (originalRelations && originalRelations.length > 0) {
      // Buscar tickets do novo evento
      const newEventTickets = await Database.from('tickets')
        .where('event_id', targetEventId);

      const relations = originalRelations.map((relation) => {
        // Encontrar o ticket correspondente no novo evento
        const correspondingTicket = newEventTickets.find(
          (ticket) => ticket.name === relation.ticket_name || ticket.value === relation.ticket_value
        );

        return {
          event_checkout_field_id: targetFieldId,
          ticket_id: correspondingTicket ? correspondingTicket.id : relation.ticket_id,
        };
      });

      await dynamicService.bulkCreate({
        modelName: 'EventCheckoutFieldTicket',
        records: relations,
      });
    }
  }

  public async getTopActiveEventsByCategory(limit: number = 10): Promise<any> {
    const now = DateTime.now();
    
    // Buscar todos os eventos ativos usando o Lucid ORM com preloads
    const whereConditions = {
      start_date_gt: now.toSQL(),
    };
    
    const preloads = [
      'attachments',
      'address', 
      'category',
      'status'
    ];
    
    // Buscar eventos com preloads e aplicar agrupamento
    const groupedEvents = await EventGroupingService.applyEventGroupingWithPreloads(whereConditions, preloads);
    
    // Agrupar eventos por categoria
    const categoriesMap = new Map<string, any>();
    
    for (const event of groupedEvents) {
      // Verificar se o evento tem categoria
      if (!event.category) continue;
      
      const categoryId = event.category.id;
      const categoryName = event.category.name;
      
      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          category_id: categoryId,
          category_name: categoryName,
          events_count: 0,
          events: []
        });
      }
      
      const category = categoriesMap.get(categoryId);
      category.events.push(event);
      category.events_count++;
    }

    // Converter para array e ordenar por número de eventos
    const result = Array.from(categoriesMap.values())
      .sort((a, b) => b.events_count - a.events_count);

    // Limitar o número total de eventos distribuindo entre as categorias
    let totalEventsAdded = 0;
    const finalResult: any[] = [];
    
    for (const category of result) {
      if (totalEventsAdded >= limit) break;
      
      const eventsToAdd = Math.min(
        category.events.length,
        limit - totalEventsAdded,
        Math.max(1, Math.floor(limit / 5))
      );
      
      finalResult.push({
        category_id: category.category_id,
        category_name: category.category_name,
        events_count: eventsToAdd,
        events: category.events.slice(0, eventsToAdd)
      });
      
      totalEventsAdded += eventsToAdd;
    }

    return finalResult;
  }

  /**
   * Método utilitário para aplicar agrupamento de eventos em qualquer consulta
   * Útil para manter consistência em todas as buscas de eventos da API
   */
  public async getEventsWithSessionGrouping(baseQuery: any): Promise<any[]> {
    return await EventGroupingService.applyEventGrouping(baseQuery);
  }
}
