import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreatePdvUsersValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    pdv_id: schema.string({}, [rules.exists({ table: 'pdvs', column: 'id' })]),
    user_id: schema.string({}, [rules.exists({ table: 'users', column: 'id' })]),
  });

  public messages = {
    'pdv_id.required': 'O campo "pdv_id" é obrigatório.',
    'pdv_id.exists': 'O pdv especificado não existe.',
    'user_id.required': 'O campo "user_id" é obrigatório.',
    'user_id.exists': 'O usuário especificado não existe.',
  };
}

class UpdatePdvUsersValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({}, [rules.exists({ table: 'pdv_users', column: 'id' })]),
    pdv_id: schema.string.optional({}, [rules.exists({ table: 'pdvs', column: 'id' })]),
    user_id: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.exists': 'O pdv usuário especificado não existe.',
    'pdv_id.exists': 'O pdv especificado não existe.',
    'user_id.exists': 'O usuário especificado não existe.',
  };
}

export { CreatePdvUsersValidator, UpdatePdvUsersValidator };
