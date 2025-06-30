import Database from '@ioc:Adonis/Lucid/Database';
import { DateTime } from 'luxon';

interface EventTotals {
  totalSales: number;              // Número de vendas confirmadas (customer_tickets)
  totalSalesToday: number;         // Vendas confirmadas hoje
  totalSalesAmount: number;        // Valor total das vendas confirmadas
  totalSalesAmountToday: number;   // Valor das vendas confirmadas hoje
  totalViews: number;              // Visualizações do evento
}

export default class EventTotalizersService {
  /**
   * Calcula os totalizadores para um evento específico
   * Segue exatamente a mesma lógica do EventService.getTotalizers
   * Considera apenas vendas confirmadas (customer_tickets)
   */
  public async calculateEventTotals(eventId: string): Promise<EventTotals> {
    try {
      const today = DateTime.now().startOf('day');

      // Buscar vendas confirmadas usando a mesma lógica do EventService
      // customer_tickets = ingressos com vendas confirmadas/aprovadas
      const totalizers = await Database
        .from('customer_tickets')
        .join('payment_tickets', 'customer_tickets.payment_ticket_id', 'payment_tickets.id')
        .join('payments', 'payment_tickets.payment_id', 'payments.id')
        .where('payments.event_id', eventId)
        .select('payments.net_value as net_value', 'customer_tickets.created_at as created_at');

      // Buscar visualizações do evento
      const totalViews = await Database
        .from('event_views')
        .where('event_id', eventId)
        .count('* as total');

      // Inicializar totalizadores
      let total = {
        totalSales: 0,
        totalSalesToday: 0,
        totalSalesAmount: 0,
        totalSalesAmountToday: 0,
        totalViews: Number(totalViews[0]?.total) || 0,
      };

      // Processar cada venda confirmada
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
    } catch (error) {
      console.error(`Erro ao calcular totalizadores para evento ${eventId}:`, error);
      
      // Retorna valores zerados em caso de erro
      return {
        totalSales: 0,
        totalSalesToday: 0,
        totalSalesAmount: 0,
        totalSalesAmountToday: 0,
        totalViews: 0,
      };
    }
  }

  /**
   * Calcula os totalizadores para múltiplos eventos de uma vez (otimização de performance)
   * Segue a mesma lógica do EventService.getTotalizers mas em lote
   */
  public async calculateMultipleEventTotals(eventIds: string[]): Promise<Record<string, EventTotals>> {
    if (eventIds.length === 0) return {};

    try {
      const today = DateTime.now().startOf('day');

      // Buscar vendas confirmadas em lote usando customer_tickets
      const salesQuery = await Database
        .from('customer_tickets')
        .join('payment_tickets', 'customer_tickets.payment_ticket_id', 'payment_tickets.id')
        .join('payments', 'payment_tickets.payment_id', 'payments.id')
        .whereIn('payments.event_id', eventIds)
        .select(
          'payments.event_id',
          'payments.net_value as net_value',
          'customer_tickets.created_at as created_at'
        );

      // Buscar visualizações em lote
      const viewsQuery = await Database
        .from('event_views')
        .whereIn('event_id', eventIds)
        .select('event_id')
        .count('* as total')
        .groupBy('event_id');

      // Organizar visualizações por event_id
      const viewsByEventId = viewsQuery.reduce((acc, row) => {
        acc[row.event_id] = Number(row.total) || 0;
        return acc;
      }, {});

      // Criar o resultado final processando vendas por evento
      const result: Record<string, EventTotals> = {};

      // Inicializar todos os eventos com valores zerados
      for (const eventId of eventIds) {
        result[eventId] = {
          totalSales: 0,
          totalSalesToday: 0,
          totalSalesAmount: 0,
          totalSalesAmountToday: 0,
          totalViews: viewsByEventId[eventId] || 0,
        };
      }

      // Processar cada venda
      for (const sale of salesQuery) {
        const eventId = sale.event_id;
        
        if (result[eventId]) {
          result[eventId].totalSales += 1;
          result[eventId].totalSalesAmount += Number(sale.net_value);

          const createdAt = DateTime.fromJSDate(sale.created_at).startOf('day');
          if (createdAt.equals(today)) {
            result[eventId].totalSalesToday += 1;
            result[eventId].totalSalesAmountToday += Number(sale.net_value);
          }
        }
      }

      return result;
    } catch (error) {
      console.error('Erro ao calcular totalizadores em lote:', error);
      
      // Retorna valores zerados para todos os eventos em caso de erro
      const result: Record<string, EventTotals> = {};
      for (const eventId of eventIds) {
        result[eventId] = {
          totalSales: 0,
          totalSalesToday: 0,
          totalSalesAmount: 0,
          totalSalesAmountToday: 0,
          totalViews: 0,
        };
      }
      return result;
    }
  }

  /**
   * Adiciona totalizadores aos eventos de um grupo
   * Usa a mesma lógica do EventService.getTotalizers
   */
  public async addTotalizersToEvents(eventGroupData: any[]): Promise<any[]> {
    const processedData: any[] = [];

    // Coletar todos os IDs de eventos para calcular em lote
    const allEventIds: string[] = [];
    for (const group of eventGroupData) {
      if (group.events && Array.isArray(group.events)) {
        for (const event of group.events) {
          if (event.id) {
            allEventIds.push(event.id);
          }
        }
      }
    }

    // Calcular totalizadores em lote para melhor performance
    const eventTotals = await this.calculateMultipleEventTotals(allEventIds);

    for (const group of eventGroupData) {
      const processedGroup = { ...group };

      // Verifica se o grupo tem eventos precarregados
      if (processedGroup.events && Array.isArray(processedGroup.events)) {
        const eventsWithTotals: any[] = [];

        for (const event of processedGroup.events) {
          const eventWithTotals = { ...event };
          
          // Busca os totalizadores já calculados ou valores padrão
          const totals = eventTotals[event.id] || {
            totalSales: 0,
            totalSalesToday: 0,
            totalSalesAmount: 0,
            totalSalesAmountToday: 0,
            totalViews: 0,
          };
          
          // Adiciona os totalizadores ao evento
          eventWithTotals.totalizers = totals;
          
          eventsWithTotals.push(eventWithTotals);
        }

        processedGroup.events = eventsWithTotals;
      }

      processedData.push(processedGroup);
    }

    return processedData;
  }

  /**
   * Verifica se a busca inclui preload de eventos
   */
  public hasEventsPreload(query: any): boolean {
    if (!query.preloads) return false;
    
    return query.preloads.includes('events') || 
           query.preloads.some((preload: string) => preload.startsWith('events:'));
  }
}