import HttpHeader from 'App/Models/Transfer/HttpHeader';
import HttpBody from 'App/Models/Transfer/HttpBody';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import DynamicService from 'App/Services/v1/DynamicService';

const dynamicService = new DynamicService();

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
  user_id: string | null,
  module: string,
  action: string,
  entity_id: string | null = null,
  old_data: Record<string, any> | null = null,
  new_data: Record<string, any> | null = null
): Promise<void> {
  try {
    if (user_id) {
      const payload = {
        user_id,
        module,
        action,
        entity_id,
        old_data: old_data ? JSON.stringify(old_data) : null,
        new_data: new_data ? JSON.stringify(new_data) : null,
      };

      await dynamicService.create('AuditLog', payload);
    } else {
      console.error('Missing User ID for Audit Log');
      console.error('Module ->', module);
      console.error('Action ->', action);
      console.error('Entity ID ->', entity_id);
      console.error('Old Data ->', old_data);
      console.error('New Data ->', new_data);
    }
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
}

function sanitizeParams(params: any) {
  for (const key in params) {
    if (params[key] === '') {
      params[key] = null;
    }
  }

  return params;
}

export default { getHeaders, getBody, getResponse, createAudity, sanitizeParams };
