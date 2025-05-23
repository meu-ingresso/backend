import HttpHeader from 'App/Models/Transfer/HttpHeader';
import HttpBody from 'App/Models/Transfer/HttpBody';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import DynamicService from 'App/Services/v1/DynamicService';
import UserService from 'App/Services/v1/UserService';
import EventService from 'App/Services/v1/EventService';
import AuditService from 'App/Services/v1/AuditService';

const dynamicService = new DynamicService();
const userService = new UserService();
const eventService = new EventService();
const auditService = new AuditService();

function getHeaders() {
  const headers: HttpHeader[] = [{ key: 'Content-type', value: 'application/json' }];

  return headers;
}

function getBody(code: string, result: any) {
  const body: HttpBody = { code, result };

  return body;
}

function getResponse(context: HttpContextContract, code: number, body: any) {
  const headers = getHeaders();

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
  await auditService.create(action, entity, entity_id, user_id, old_data, new_data);
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
        case 'TicketField':
          event_id = item?.checkoutField?.event_id;

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
  const body = getBody(type, message);

  return getResponse(context, status, body);
}

async function handleSuccess(context: HttpContextContract, result: any, code: string, statusCode: number) {
  const body = getBody(code, result);

  return getResponse(context, statusCode, body);
}

async function getUserWithRole(userId: string): Promise<any | null> {
  if (!userId) {
    return null;
  }

  const user = await dynamicService.search('User', {
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

    const event = await dynamicService.search('Event', {
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
  createAudity,
  getInfosByRole,
  handleError,
  handleSuccess,
  checkHasEventPermission,
  checkHasAdminPermission,
};
