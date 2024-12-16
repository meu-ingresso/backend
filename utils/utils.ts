import HttpHeader from 'App/Models/Transfer/HttpHeader';
import HttpBody from 'App/Models/Transfer/HttpBody';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import DynamicService from 'App/Services/v1/DynamicService';
import UserService from 'App/Services/v1/UserService';
import EventService from 'App/Services/v1/EventService';

const dynamicService = new DynamicService();
const userService = new UserService();
const eventService = new EventService();

function getHeaders() {
  const headers: HttpHeader[] = [{ key: 'Content-type', value: 'application/json' }];

  return headers;
}

function getBody(code: string, result: any) {
  const body: HttpBody = { code, result };

  return body;
}

function getResponse(context: HttpContextContract, code: number, headers: any, body: any) {
  const response: any = context.response.status(code).send({ headers, body });

  return response;
}

async function createAudity(
  action: string,
  entity: string,
  entity_id: string | null = null,
  user_id: string | null,
  old_data: Record<string, any> | null = null,
  new_data: Record<string, any> | null = null
): Promise<void> {
  try {
    if (user_id) {
      const payload = {
        action,
        entity,
        entity_id,
        user_id,
        old_data: old_data ? JSON.stringify(old_data) : null,
        new_data: new_data ? JSON.stringify(new_data) : null,
      };

      await dynamicService.create('AuditLog', payload);
    } else {
      console.error('Missing User ID for Audit Log');
      console.error('Module ->', module);
      console.error('Action ->', entity);
      console.error('Entity ID ->', entity_id);
      console.error('Old Data ->', old_data);
      console.error('New Data ->', new_data);
    }
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
}

async function getInfosByRole(userId: string, data: any, module: string) {
  const user = await userService.getUserInfos(userId);

  let result = data;

  if (user && user?.$preloaded?.role?.$attributes?.name === 'Admin') return result;

  const res: typeof result.data = [];

  for (let i = 0; i < result.data.length; i++) {
    const event_id = module === 'Event' ? result.data[i].id : result.data[i].event_id;
    const event = await eventService.getEventByIdWithAllPreloads(event_id);

    const isPromoter = event.promoter_id === user.id;

    const isCollaborator = event.collaborators?.some((collaborator: any) => collaborator.user_id === user.id);

    if (isPromoter || isCollaborator) {
      res.push(result.data[i]);
    }
  }

  result.meta.total = res.length;
  result.data = res;

  return result;
}

export default { getHeaders, getBody, getResponse, createAudity, getInfosByRole };
