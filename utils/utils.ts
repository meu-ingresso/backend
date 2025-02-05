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
  user_id: string | null = null,
  old_data: Record<string, any> | null = null,
  new_data: Record<string, any> | null = null
): Promise<void> {
  try {
    const payload = {
      action,
      entity,
      entity_id,
      user_id,
      old_data: old_data ? JSON.stringify(old_data) : null,
      new_data: new_data ? JSON.stringify(new_data) : null,
    };

    await dynamicService.create('AuditLog', payload);
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
}

async function getInfosByRole(userId: string, data: any, module: string): Promise<typeof data> {
  const user = await userService.getUserInfos(userId);

  if (user?.$preloaded?.role?.$attributes?.name === 'Admin') {
    return data;
  }

  const res: typeof data.data = [];

  const filteredData = await Promise.all(
    data.data.map(async (item) => {
      let event_id;

      switch (module) {
        case 'Event':
          event_id = item.id;
          break;
        case 'CouponsTickets':
          const coupon = await dynamicService.getById('Coupon', item.coupon_id);

          event_id = coupon?.event_id;

          break;
        default:
          event_id = item.event_id;
      }

      if (!event_id) return null;

      const event = await eventService.getEventByIdWithAllPreloads(event_id);

      const isPromoter = event.promoter_id === user.id;
      const isCollaborator = event.collaborators?.some((collaborator: any) => collaborator.user_id === user.id);

      return isPromoter || isCollaborator ? item : null;
    })
  );

  res.push(...filteredData.filter((item) => item !== null));

  data.meta.total = res.length;
  data.data = res;

  return data;
}

async function handleError(context: HttpContextContract, status: number, type: string, message: string) {
  const headers = getHeaders();
  const body = getBody(type, message);

  return getResponse(context, status, headers, body);
}

async function handleSuccess(context: HttpContextContract, result: any, code: string, statusCode: number) {
  const headers = getHeaders();
  const body = getBody(code, result);

  return getResponse(context, statusCode, headers, body);
}

async function getUserWithRole(userId: string): Promise<any | null> {
  if (!userId) {
    return null;
  }

  const user = await dynamicService.searchActives('User', {
    where: { id: { v: userId } },
    preloads: ['role'],
  });

  return user?.data?.[0] || null;
}

async function checkHasEventPermission(userId: string, eventId?: string): Promise<boolean> {
  try {
    const userData = await getUserWithRole(userId);

    if (!userData) {
      return false;
    }

    if (userData.role?.name === 'Admin') {
      return true;
    }

    if (!eventId) {
      return true;
    }

    const event = await dynamicService.searchActives('Event', {
      where: { id: { v: eventId } },
      preloads: ['collaborators'],
    });

    const eventData = event?.data?.[0];
    if (!eventData) {
      return false;
    }

    if (eventData.promoter_id === userId) {
      return true;
    }

    return (
      eventData.collaborators?.some((collaborator) => collaborator.user_id === userId && !collaborator.deleted_at) ??
      false
    );
  } catch (error) {
    console.error('Error checking event permission:', error);
    return false;
  }
}

async function checkHasAdminPermission(userId: string): Promise<boolean> {
  try {
    const userData = await getUserWithRole(userId);

    if (!userData) {
      return false;
    }

    return userData.role?.name === 'Admin';
  } catch (error) {
    console.error('Error checking admin permission:', error);
    return false;
  }
}

export default {
  getHeaders,
  getBody,
  getResponse,
  createAudity,
  getInfosByRole,
  handleError,
  handleSuccess,
  checkHasEventPermission,
  checkHasAdminPermission,
};
