import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateUserValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    alias: schema.string.optional(),
    password: schema.string(),
    role_id: schema.string({}, [rules.exists({ table: 'roles', column: 'id' })]),
  });

  public messages = {
    'email.required': 'O campo "email" é obrigatório.',
    'email.email': 'O campo "email" deve conter um endereço de e-mail válido.',
    'email.unique': 'O e-mail fornecido já está registrado.',
    'password.required': 'O campo "password" é obrigatório.',
    'alias.string': 'O campo "alias" deve ser uma string válida.',
    'password.string': 'O campo "password" deve ser uma string válida.',
    'role_id.required': 'O campo "role_id" é obrigatório.',
    'role_id.string': 'O campo "role_id" deve ser uma string válida.',
  };
}

class UpdateUserValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    email: schema.string.optional({}, [rules.email()]),
    alias: schema.string.optional(),
    password: schema.string.optional(),
    role_id: schema.string.optional(),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.string': 'O campo "id" deve ser uma string válida.',
    'email.email': 'O campo "email" deve conter um endereço de e-mail válido.',
    'alias.string': 'O campo "alias" deve ser uma string válida.',
    'password.string': 'O campo "password" deve ser uma string válida.',
    'role_id.string': 'O campo "role_id" deve ser uma string válida.',
  };
}

export { CreateUserValidator, UpdateUserValidator };
