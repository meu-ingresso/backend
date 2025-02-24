import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateRolePermissionValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        role_id: schema.string({ trim: true }, [rules.exists({ table: 'roles', column: 'id' })]),
        permission_id: schema.string({ trim: true }, [rules.exists({ table: 'permissions', column: 'id' })]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.role_id.required': 'O campo "role_id" é obrigatório.',
    'data.*.role_id.string': 'O campo "role_id" deve ser uma string válida.',
    'data.*.role_id.exists': 'O "role_id" fornecido não existe na tabela de roles.',
    'data.*.permission_id.required': 'O campo "permission_id" é obrigatório.',
    'data.*.permission_id.string': 'O campo "permission_id" deve ser uma string válida.',
    'data.*.permission_id.exists': 'O "permission_id" fornecido não existe na tabela de permissions.',
  };
}

export { CreateRolePermissionValidator };
