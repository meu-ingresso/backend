import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateEventValidator, UpdateEventValidator } from 'App/Validators/v1/EventsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import EventService from 'App/Services/v1/EventService';
import utils from 'Utils/utils';
import { schema, rules } from '@ioc:Adonis/Core/Validator';


export default class EventsController {
  private dynamicService: DynamicService = new DynamicService();
  private eventService: EventService = new EventService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventValidator);

    const ableToCreate = await utils.checkHasEventPermission(context.auth.user!.id);

    if (!ableToCreate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    let group_id = payload.data[0].group_id || null;

    payload.data.forEach((event) => {
      delete event.group_id;
    });

    const result = await this.dynamicService.bulkCreate({
      modelName: 'Event',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'CREATE_ERROR', `${result[0].error}`);
    }

    const fees = result.map((element) => {
      return {
        event_id: element.id,
        platform_fee: 10,
      };
    });

    this.dynamicService.bulkCreate({
      modelName: 'EventFee',
      records: fees,
      userId: context.auth.user?.$attributes.id,
    });

    if (!group_id) {
      const groupPayload = {
        name: payload.data[0].name + ' - ' + result[0].id,
        description: payload.data[0].description,
      };

      const group = await this.dynamicService.create('EventGroup', groupPayload);

      group_id = group.id;
    }

    this.dynamicService.bulkCreate({
      modelName: 'EventGroupRelation',
      records: result.map((event) => {
        return {
          group_id,
          event_id: event.id,
        };
      }),
    });

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async validateAlias(context: HttpContextContract) {
    const alias = context.request.params().alias;

    const result = await this.eventService.validateAlias(alias);

    return utils.handleSuccess(context, result, 'VALIDATE_SUCCESS', 200);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateEventValidator);

    const oldData = await this.dynamicService.getById('Event', payload.data[0].id);
    const ableToUpdate = await utils.checkHasEventPermission(context.auth.user!.id, oldData.id);

    if (!ableToUpdate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.bulkUpdate({
      modelName: 'Event',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'UPDATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'UPDATE_SUCCESS', 200);
  }

  public async search(context: HttpContextContract) {
    const query = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.search('Event', query);

    if (result && result.data && !!result.data.length) {
      for (let i = 0; i < result.data.length; i++) {
        const totalizer = await this.eventService.getTotalizers(result.data[i].id);
        result.data[i].totalizers = totalizer;
      }
    }

    const resultByRole = await utils.getInfosByRole(context.auth.user!.id, result, 'Event');

    return utils.handleSuccess(context, resultByRole, 'SEARCH_SUCCESS', 200);
  }

  public async showcase(context: HttpContextContract) {
    let query = await context.request.validate(QueryModelValidator);

    query = {
      ...query,
      whereHas: {
        ...query?.whereHas,
        status: {
          name: { v: 'Publicado' },
        },
      },
    };

    const result = await this.dynamicService.search('Event', query);

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('Event', id);
    const ableToDelete = await utils.checkHasEventPermission(context.auth.user!.id, oldData.id);

    if (!ableToDelete) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.softDelete({
      modelName: 'Event',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }

  public async getByPromoterAlias(context: HttpContextContract) {
    const alias = context.request.params().alias;
    const query = await context.request.validate(QueryModelValidator);

    // Busca o promotor pelo alias
    const promoterQuery = {
      where: {
        alias: { v: alias },
      },
      preloads: ['people', 'attachments', 'role'],
    };

    const promoterResult = await this.dynamicService.search('User', promoterQuery);
    
    if (!promoterResult.data || !promoterResult.data.length) {
      return utils.handleError(context, 404, 'NOT_FOUND', 'PROMOTER_NOT_FOUND');
    }

    const promoter = promoterResult.data[0];
    
    // Verifica se o papel do usuário é de promotor
    if (!promoter.role || !['Produtor', 'Admin'].includes(promoter.role.name)) {
      return utils.handleError(context, 404, 'NOT_FOUND', 'PROMOTER_NOT_FOUND');
    }

    // Busca eventos do promotor com os parâmetros de consulta fornecidos
    const eventsQuery = {
      ...(query || {}),
      where: {
        ...(query?.where || {}),
        promoter_id: { v: promoter.id },
        deleted_at: { v: null },
      },
      whereHas: {
        ...(query?.whereHas || {}),
        status: {
          name: { v: 'Publicado' },
        },
      },
      preloads: query?.preloads || [
        'status',
        'category',
        'rating',
        'address',
        'tickets',
        'attachments',
        'views',
        'fees',
        'groups'
      ],
      orderBy: query?.orderBy || ['start_date:desc'],
      page: query?.page || 1,
      limit: query?.limit || 10,
    };

    const eventsResult = await this.dynamicService.search('Event', eventsQuery);
    
    // Adiciona totalizadores para cada evento
    if (eventsResult.data && eventsResult.data.length > 0) {
      for (let i = 0; i < eventsResult.data.length; i++) {
        const totalizer = await this.eventService.getTotalizers(eventsResult.data[i].id);
        eventsResult.data[i].totalizers = totalizer;
      }
    }

    // Prepara informações do promotor
    const profileImage = promoter.attachments?.find(
      (attachment) => attachment.name === 'profile_image' && attachment.value
    ) || '';
    
    const biography = promoter.attachments?.find(
      (attachment) => attachment.name === 'biography' && attachment.value
    ) || '';

    // Monta a resposta
    const result = {
      promoter: {
        id: promoter.id,
        alias: promoter.alias,
        name: promoter.people?.name,
        email: promoter.email,
        role: promoter.role?.name,
        avatar: profileImage,
        biography: biography,
      },
      events: {
        data: eventsResult.data || [],
        meta: eventsResult.meta || null,
      },
    };

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async createSessions(context: HttpContextContract) {
    // Validação dos dados recebidos

    console.log("Validando dados recebidos");

    const { eventUuid, sessions } = await context.request.validate({
      schema: schema.create({
        eventUuid: schema.string({}, [rules.uuid()]),
        sessions: schema.array().members(
          schema.object().members({
            start_date: schema.date(),
            end_date: schema.date(),
          })
        ),
      }),
    });

    console.log("Dados validados com sucesso");

    try {

      // Verificar permissões
      const originalEventResult = await this.dynamicService.search('Event', {
        where: { id: { v: eventUuid } },
        limit: 1,
      });
      
      if (!originalEventResult?.data?.[0]) {
        return utils.handleError(context, 404, 'NOT_FOUND', 'EVENT_NOT_FOUND');
      }

      console.log("Verificando permissões");
      
      const ableToCreate = await utils.checkHasEventPermission(context.auth.user!.id, originalEventResult.data[0].id);
      if (!ableToCreate) {
        return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
      }

      console.log("Criando sessões");

      // Delegar a lógica de criação de sessões para o EventService
      const result = await this.eventService.createSessions(
        eventUuid, 
        sessions
      );
      
      console.log("Sessões criadas com sucesso");

      return utils.handleSuccess(context, result, 'SESSIONS_CREATED', 201);
    } catch (error) {
      if (error.message === 'EVENT_NOT_FOUND') {
        return utils.handleError(context, 404, 'NOT_FOUND', 'EVENT_NOT_FOUND');
      } else if (error.message === 'ORIGINAL_EVENT_HAS_NO_GROUP') {
        return utils.handleError(context, 400, 'BAD_REQUEST', 'ORIGINAL_EVENT_HAS_NO_GROUP');
      }
      
      return utils.handleError(context, 500, 'SERVER_ERROR', `${error.message}`);
    }
  }

  public async duplicateEvent(context: HttpContextContract) {
    try {
      const { eventId } = await context.request.validate({
        schema: schema.create({
          eventId: schema.string({}, [rules.uuid()]),
        }),
      });

      const result = await this.eventService.duplicateEvent(eventId);

      return utils.handleSuccess(context, result, 'DUPLICATE_SUCCESS', 201);
    } catch (error) {
      return utils.handleError(context, 500, 'SERVER_ERROR', `${error.message}`);
    }
  }
}
