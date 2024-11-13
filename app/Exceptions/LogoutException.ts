import { Exception as StandaloneException } from '@adonisjs/core/build/standalone'
import Logger from "@ioc:Adonis/Core/Logger"

export default class LogoutException extends StandaloneException {

  constructor(code: string , status: number = 500) {
    super(`exceptions.${code}`, status, code);
  }

  public report(error: this) {
    Logger.error(JSON.stringify(error))
  }
}
