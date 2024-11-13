import HttpContext, { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Exception as StandaloneException } from '@adonisjs/core/build/standalone';

export default class Exception extends StandaloneException {
  constructor(code: string, status: number = 500) {
    const ctx: HttpContextContract = HttpContext.getOrFail();

    super(ctx.i18n.formatMessage(`exceptions.${code}`), status, code);
  }
}
