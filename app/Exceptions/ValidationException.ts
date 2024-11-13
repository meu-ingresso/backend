import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Exception as StandaloneException } from '@adonisjs/core/build/standalone';
import Logger from '@ioc:Adonis/Core/Logger';

export default class ValidationException extends StandaloneException {
  private errors: any;

  constructor(errors: any, code: string = 'VALIDATION_ERROR', status: number = 400) {
    super(`exceptions.${code}`, status, code);

    this.errors = errors;
  }

  async makeJSONResponse(error, ctx) {
    ctx.response.status(error.status).send({
      code: error.code,
      result: {
        title: error.name || 'ExceptionHandler',
        message: error.message,
        errors: this.errors,
        ...(process.env.NODE_ENV === 'development' ? { stack: error.stack.split('\n') } : {}),
      },
    });
  }

  async makeJSONAPIResponse(error, ctx) {
    ctx.response.status(error.status).send({
      errors: this.errors,
    });
  }

  public async handle(error: any, ctx: HttpContextContract) {
    error.status = error.status || 400;

    switch (ctx.request.accepts(['html', 'application/vnd.api+json', 'json'])) {
      case 'json':
      case null:
        return this.makeJSONResponse(error, ctx);
      case 'application/vnd.api+json':
        return this.makeJSONAPIResponse(error, ctx);
    }
  }

  public report(error: this) {
    Logger.error(JSON.stringify(error));
  }
}
