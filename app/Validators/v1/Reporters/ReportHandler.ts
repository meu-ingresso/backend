import {
  MessagesBagContract,
  ErrorReporterContract,
} from '@ioc:Adonis/Core/Validator'

import ValidationException from 'App/Exceptions/ValidationException'

type ErrorNode = {
  message: string,
  rule: string,
  field: string,
}

export default class ReportHandler implements ErrorReporterContract<void> {
  public hasErrors = false

  private errors: ErrorNode[] = []

  constructor (
    private messages: MessagesBagContract,
    private bail: boolean,
  ) {
  }

  public report (
    pointer: string,
    rule: string,
    message: string,
    arrayExpressionPointer?: string,
    args?: any
  ) {
    this.hasErrors = true

    const errorMessage = this.messages.get(
      pointer,
      rule,
      message,
      arrayExpressionPointer,
      args,
    )

    this.errors.push({ message: errorMessage, rule: rule, field: pointer })

    if (this.bail) {
      throw this.toError()
    }
  }

  public toError () {
    throw new ValidationException(this.errors, "VALIDATION_ERROR", 400)
  }

  public toJSON () {
    this.toError()
  }
}
