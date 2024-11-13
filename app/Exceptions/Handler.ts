import Logger from '@ioc:Adonis/Core/Logger';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler';

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger);
  }

  async makeJSONResponse(error, ctx: HttpContextContract) {
    if (ctx && ctx.response) {
      ctx.response.status(error.status).send({
        code: error.code,
        result: {
          title: error.name || 'ExceptionHandler',
          message: error.message,
          ...(process.env.NODE_ENV === 'development' && !ctx.request.header('X-Api-Key')
            ? { stack: error.stack.split('\n') }
            : {}),
        },
      });
    } else {
      console.error('Error:', error);
    }
  }

  async makeJSONAPIResponse(error, ctx: HttpContextContract) {
    if (ctx && ctx.response) {
      ctx.response.status(error.status).send({
        errors: [
          {
            title: error.message,
            ...(process.env.NODE_ENV === 'development' && !ctx.request.header('X-Api-Key')
              ? { detail: error.stack.split('\n') }
              : {}),
            code: error.code,
            status: error.status,
          },
        ],
      });
    } else {
      console.error('Error:', error);
    }
  }

  public async handle(error: any, ctx: HttpContextContract) {
    error.status = error.status || 500;

    if (typeof error.handle === 'function') {
      return error.handle(error, ctx);
    }

    switch (ctx.request.accepts(['html', 'application/vnd.api+json', 'json'])) {
      case 'html':
      case null:
        return this.makeHtmlResponse(error, ctx);
      case 'json':
        return this.makeJSONResponse(error, ctx);
      case 'application/vnd.api+json':
        return this.makeJSONAPIResponse(error, ctx);
    }
  }
}
