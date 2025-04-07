import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateUserValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
        people_id: schema.string({}, [rules.exists({ table: 'people', column: 'id' })]),
        alias: schema.string({}, [rules.unique({ table: 'users', column: 'alias' })]),
        password: schema.string(),
        role_id: schema.string({}, [rules.exists({ table: 'roles', column: 'id' })]),
        account_verified: schema.boolean.optional(),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.email.required': 'O campo "email" é obrigatório.',
    'data.*.email.email': 'O campo "email" deve conter um endereço de e-mail válido.',
    'data.*.email.unique': 'O e-mail fornecido já está registrado.',
    'data.*.people_id.required': 'O campo "people_id" é obrigatório.',
    'data.*.people_id.exists': 'O usuário especificado não existe.',
    'data.*.alias.required': 'O campo "alias" é obrigatório.',
    'data.*.alias.unique': 'O alias fornecido já está em uso.',
    'data.*.password.required': 'O campo "password" é obrigatório.',
    'data.*.password.string': 'O campo "password" deve ser uma string válida.',
    'data.*.role_id.required': 'O campo "role_id" é obrigatório.',
    'data.*.role_id.string': 'O campo "role_id" deve ser uma string válida.',
    'data.*.account_verified.boolean': 'O campo "account_verified" deve ser um booleano válido.',
  };
}

class UpdateUserValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({}, [rules.exists({ table: 'users', column: 'id' })]),
        email: schema.string.optional({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
        people_id: schema.string.optional({}, [rules.exists({ table: 'people', column: 'id' })]),
        alias: schema.string.optional(),
        password: schema.string.optional(),
        role_id: schema.string.optional({}, [rules.exists({ table: 'roles', column: 'id' })]),
        account_verified: schema.boolean.optional(),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O usuário especificado não existe.',
    'data.*.email.email': 'O campo "email" deve conter um endereço de e-mail válido.',
    'data.*.email.unique': 'O e-mail fornecido já está registrado.',
    'data.*.people_id.exists': 'O usuário especificado não existe.',
    'data.*.alias.string': 'O campo "alias" deve ser uma string válida.',
    'data.*.password.string': 'O campo "password" deve ser uma string válida.',
    'data.*.role_id.string': 'O campo "role_id" deve ser uma string válida.',
    'data.*.account_verified.boolean': 'O campo "account_verified" deve ser um booleano válido.',
  };
}

export { CreateUserValidator, UpdateUserValidator };
