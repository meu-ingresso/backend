import Database from '@ioc:Adonis/Lucid/Database';
import Event from 'App/Models/Access/Events';

interface EventWithGroup {
  id: string;
  name: string;
  description?: string;
  alias: string;
  start_date: string;
  end_date: string;
  location_name?: string;
  event_type: string;
  is_featured: boolean;
  group_id?: string;
  group_name?: string;
  group_description?: string;
  [key: string]: any;
}

interface GroupedEvent {
  id: string;
  name: string;
  description?: string;
  alias: string;
  location_name?: string;
  event_type: string;
  is_featured: boolean;
  group_id?: string;
  group_name?: string;
  group_description?: string;
  sessions_count: number;
  main_session: {
    id: string;
    start_date: string;
    end_date: string;
    alias: string;
  };
  sessions: Array<{
    id: string;
    start_date: string;
    end_date: string;
    alias: string;
  }>;
  [key: string]: any;
}

export default class EventGroupingService {
  
  /**
   * Transforma uma lista de eventos em eventos agrupados por sessões
   */
  public static groupEventsBySessions(events: EventWithGroup[]): GroupedEvent[] {
    const groupedEvents = new Map<string, GroupedEvent>();
    const standaloneEvents: GroupedEvent[] = [];

    for (const event of events) {
      if (event.group_id) {
        // Evento pertence a um grupo - tratar como sessão
        const groupKey = event.group_id;
        
        if (groupedEvents.has(groupKey)) {
          // Adicionar como sessão ao evento existente
          const existingEvent = groupedEvents.get(groupKey)!;
          
          existingEvent.sessions.push({
            id: event.id,
            start_date: event.start_date,
            end_date: event.end_date,
            alias: event.alias,
          });
          
          existingEvent.sessions_count = existingEvent.sessions.length;
          
          // Atualizar a sessão principal para a mais próxima
          const currentMainDate = new Date(existingEvent.main_session.start_date);
          const newEventDate = new Date(event.start_date);
          
          if (newEventDate < currentMainDate) {
            existingEvent.main_session = {
              id: event.id,
              start_date: event.start_date,
              end_date: event.end_date,
              alias: event.alias,
            };
            
            // Atualizar informações principais com base na sessão mais próxima
            existingEvent.id = event.id;
            existingEvent.alias = event.alias;
            existingEvent.is_featured = event.is_featured;
          }
        } else {
          // Primeiro evento do grupo
          const { group_id, group_name, group_description, ...eventData } = event;
          
          const groupedEvent: GroupedEvent = {
            ...eventData,
            group_id,
            group_name,
            group_description,
            sessions_count: 1,
            main_session: {
              id: event.id,
              start_date: event.start_date,
              end_date: event.end_date,
              alias: event.alias,
            },
            sessions: [{
              id: event.id,
              start_date: event.start_date,
              end_date: event.end_date,
              alias: event.alias,
            }],
          };
          
          groupedEvents.set(groupKey, groupedEvent);
        }
      } else {
        // Evento standalone - não pertence a nenhum grupo
        const standaloneEvent: GroupedEvent = {
          ...event,
          sessions_count: 1,
          main_session: {
            id: event.id,
            start_date: event.start_date,
            end_date: event.end_date,
            alias: event.alias,
          },
          sessions: [{
            id: event.id,
            start_date: event.start_date,
            end_date: event.end_date,
            alias: event.alias,
          }],
        };
        
        standaloneEvents.push(standaloneEvent);
      }
    }

    // Ordenar sessões dentro de cada grupo por data
    for (const groupedEvent of groupedEvents.values()) {
      groupedEvent.sessions.sort((a, b) => 
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      );
    }

    // Combinar eventos agrupados e standalone
    const result = [...Array.from(groupedEvents.values()), ...standaloneEvents];
    
    // Ordenar resultado final
    return result.sort((a, b) => {
      // Primeiro por is_featured
      if (a.is_featured !== b.is_featured) {
        return a.is_featured ? -1 : 1;
      }
      // Depois por data da sessão principal
      return new Date(a.main_session.start_date).getTime() - new Date(b.main_session.start_date).getTime();
    });
  }

  /**
   * Busca eventos com informações dos grupos para uso com groupEventsBySessions
   */
  public static async getEventsWithGroupInfo(baseQuery: any): Promise<EventWithGroup[]> {
    const events = await baseQuery
      .leftJoin('event_group_relations', 'events.id', 'event_group_relations.event_id')
      .leftJoin('event_groups', 'event_group_relations.group_id', 'event_groups.id')
      .select(
        'events.*',
        'event_groups.id as group_id',
        'event_groups.name as group_name',
        'event_groups.description as group_description'
      );

    return events;
  }

  /**
   * Método helper para aplicar agrupamento em qualquer busca de eventos
   */
  public static async applyEventGrouping(baseQuery: any): Promise<GroupedEvent[]> {
    const eventsWithGroupInfo = await this.getEventsWithGroupInfo(baseQuery);
    return this.groupEventsBySessions(eventsWithGroupInfo);
  }

  /**
   * Método para buscar eventos com preloads e aplicar agrupamento
   * Usa o modelo Event para permitir preloads
   */
  public static async applyEventGroupingWithPreloads(whereConditions: any, preloads: string[] = []): Promise<GroupedEvent[]> {
    let query = Event.query();

    // Aplicar condições where
    if (whereConditions.start_date_gt) {
      query = query.where('start_date', '>', whereConditions.start_date_gt);
    }
    if (whereConditions.category_id) {
      query = query.where('category_id', whereConditions.category_id);
    }
    if (whereConditions.promoter_id) {
      query = query.where('promoter_id', whereConditions.promoter_id);
    }
    if (whereConditions.is_featured !== undefined) {
      query = query.where('is_featured', whereConditions.is_featured);
    }

    // Condições adicionais
    query = query
      .whereHas('status', (statusQuery) => {
        statusQuery.where('name', 'Publicado');
      })
      .whereNull('deleted_at')
      .whereNotNull('category_id');

    // Aplicar preloads
    for (const preload of preloads) {
      if (preload === 'attachments') {
        query = query.preload('attachments', (attachmentQuery) => {
          attachmentQuery.whereNull('deleted_at').orderBy('created_at', 'desc');
        });
      } else if (preload === 'address') {
        query = query.preload('address');
      } else if (preload === 'category') {
        query = query.preload('category', (categoryQuery) => {
          categoryQuery.whereNull('deleted_at');
        });
      } else if (preload === 'status') {
        query = query.preload('status');
      } else {
        query = query.preload(preload as any);
      }
    }

    const events = await query;

    // Buscar informações de grupo separadamente para evitar conflitos
    const eventsWithGroupInfo: EventWithGroup[] = [];
    
    for (const event of events) {
      const groupRelation = await Database.from('event_group_relations')
        .leftJoin('event_groups', 'event_group_relations.group_id', 'event_groups.id')
        .where('event_group_relations.event_id', event.id)
        .select(
          'event_groups.id as group_id',
          'event_groups.name as group_name', 
          'event_groups.description as group_description'
        )
        .first();

      const eventWithGroup: EventWithGroup = {
        ...event.toJSON(),
        group_id: groupRelation?.group_id || null,
        group_name: groupRelation?.group_name || null,
        group_description: groupRelation?.group_description || null,
      } as EventWithGroup;

      eventsWithGroupInfo.push(eventWithGroup);
    }

    return this.groupEventsBySessions(eventsWithGroupInfo);
  }
} 