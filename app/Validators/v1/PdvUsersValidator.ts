import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreatePdvUsersValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        pdv_id: schema.string({}, [rules.exists({ table: 'pdvs', column: 'id' })]),
        user_id: schema.string({}, [rules.exists({ table: 'users', column: 'id' })]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.pdv_id.required': 'O campo "pdv_id" é obrigatório.',
    'data.*.pdv_id.exists': 'O pdv especificado não existe.',
    'data.*.user_id.required': 'O campo "user_id" é obrigatório.',
    'data.*.user_id.exists': 'O usuário especificado não existe.',
  };
}

class UpdatePdvUsersValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({}, [rules.exists({ table: 'pdv_users', column: 'id' })]),
        pdv_id: schema.string.optional({}, [rules.exists({ table: 'pdvs', column: 'id' })]),
        user_id: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O pdv usuário especificado não existe.',
    'data.*.pdv_id.exists': 'O pdv especificado não existe.',
    'data.*.user_id.exists': 'O usuário especificado não existe.',
  };
}

export { CreatePdvUsersValidator, UpdatePdvUsersValidator };
