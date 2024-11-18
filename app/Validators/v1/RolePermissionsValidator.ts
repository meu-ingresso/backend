import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateRolePermissionValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    role_id: schema.string({}, [rules.exists({ table: 'roles', column: 'id' })]),
    permission_id: schema.string({}, [rules.exists({ table: 'permissions', column: 'id' })]),
  });

  public messages = {
    'role_id.required': 'O campo "role_id" é obrigatório.',
    'role_id.string': 'O campo "role_id" deve ser uma string válida.',
    'role_id.exists': 'O "role_id" fornecido não existe na tabela de roles.',
    'permission_id.required': 'O campo "permission_id" é obrigatório.',
    'permission_id.string': 'O campo "permission_id" deve ser uma string válida.',
    'permission_id.exists': 'O "permission_id" fornecido não existe na tabela de permissions.',
  };
}

class UpdateRolePermissionValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.string': 'O campo "id" deve ser uma string válida.',
  };
}

export { CreateRolePermissionValidator, UpdateRolePermissionValidator };
