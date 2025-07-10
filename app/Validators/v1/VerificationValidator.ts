import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export class VerifyEmailValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    token: schema.string(),
    email: schema.string({}, [rules.required(), rules.email()]),
  });

  public messages = {
    'token.required': 'O código de verificação é obrigatório.',
    'email.required': 'O email é obrigatório.',
    'email.email': 'O email deve ser válido.',
  };
}

export class ForgotPasswordValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    email: schema.string({}, [rules.required(), rules.email()]),
  });

  public messages = {
    'email.required': 'O email é obrigatório.',
    'email.email': 'O email deve ser válido.',
  };
}

export class ResetPasswordValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    token: schema.string({}, [rules.required()]),
    email: schema.string({}, [rules.required(), rules.email()]),
    password: schema.string({}, [rules.required()]),
  });

  public messages = {
    'token.required': 'O código de recuperação é obrigatório.',
    'email.required': 'O email é obrigatório.',
    'email.email': 'O email deve ser válido.',
    'password.required': 'A nova senha é obrigatória.',
  };
}

export class ResendVerificationValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    email: schema.string({}, [rules.required(), rules.email()]),
  });

  public messages = {
    'email.required': 'O email é obrigatório.',
    'email.email': 'O email deve ser válido.',
  };
}
