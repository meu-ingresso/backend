import HttpHeader from 'App/Models/Transfer/HttpHeader';
import HttpBody from 'App/Models/Transfer/HttpBody';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import AudityService from 'App/Services/v1/AudityService';

const audityService = new AudityService();

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

async function createAudity(user_id: any, module: string, action: string, content: string) {
  if (user_id) {
    const payload = {
      user_id,
      module,
      action,
      content,
    };

    await audityService.create(payload);
  } else {
    console.error('User Id -> ', user_id);
    console.error('Module -> ', module);
    console.error('Action -> ', action);
    console.error('Content -> ', content);
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
