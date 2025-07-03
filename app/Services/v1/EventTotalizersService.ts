import Database from '@ioc:Adonis/Lucid/Database';
import { DateTime } from 'luxon';

interface EventTotals {
  totalSales: number;              // Número de vendas aprovadas (payment_tickets)
  totalSalesToday: number;         // Vendas aprovadas hoje
  totalSalesAmount: number;        // Valor total das vendas aprovadas
  totalSalesAmountToday: number;   // Valor das vendas aprovadas hoje
  totalViews: number;              // Visualizações do evento
}

export default class EventTotalizersService {
  /**
   * Calcula os totalizadores para um evento específico
   * Considera apenas pagamentos aprovados (payment_tickets + payments com status "Aprovado")
   */
  public async calculateEventTotals(eventId: string): Promise<EventTotals> {
    try {
      const today = DateTime.now().startOf('day');

      // Buscar vendas confirmadas usando pagamentos aprovados
      const totalizers = await Database
        .from('payment_tickets')
        .join('payments', 'payment_tickets.payment_id', 'payments.id')
        .join('statuses', 'statuses.id', 'payments.status_id')
        .where('payments.event_id', eventId)
        .where('statuses.name', 'Aprovado')
        .where('statuses.module', 'payment')
        .select(
          'payments.net_value as net_value', 
          'payment_tickets.created_at as created_at',
          'payment_tickets.quantity as quantity'
        );

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
        const quantity = Number(totalizer.quantity) || 1;
        
        total.totalSales += quantity;
        total.totalSalesAmount += Number(totalizer.net_value);

        const createdAt = DateTime.fromJSDate(totalizer.created_at).startOf('day');

        if (createdAt.equals(today)) {
          total.totalSalesToday += quantity;
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
   * Considera apenas pagamentos aprovados (payment_tickets + payments com status "Aprovado")
   */
  public async calculateMultipleEventTotals(eventIds: string[]): Promise<Record<string, EventTotals>> {
    if (eventIds.length === 0) return {};

    try {
      const today = DateTime.now().startOf('day');

      // Buscar vendas confirmadas em lote usando pagamentos aprovados
      const salesQuery = await Database
        .from('payment_tickets')
        .join('payments', 'payment_tickets.payment_id', 'payments.id')
        .join('statuses', 'statuses.id', 'payments.status_id')
        .whereIn('payments.event_id', eventIds)
        .where('statuses.name', 'Aprovado')
        .where('statuses.module', 'payment')
        .select(
          'payments.event_id',
          'payments.net_value as net_value',
          'payment_tickets.created_at as created_at',
          'payment_tickets.quantity as quantity'
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
        const quantity = Number(sale.quantity) || 1;
        
        if (result[eventId]) {
          result[eventId].totalSales += quantity;
          result[eventId].totalSalesAmount += Number(sale.net_value);

          const createdAt = DateTime.fromJSDate(sale.created_at).startOf('day');
          if (createdAt.equals(today)) {
            result[eventId].totalSalesToday += quantity;
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
   * Considera apenas pagamentos aprovados (payment_tickets + payments com status "Aprovado")
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