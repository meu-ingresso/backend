import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateRolePermissionValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    role_id: schema.string(),
    permission_id: schema.string(),
  });

  public messages = {};
}

class UpdateRolePermissionValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
  });

  public messages = {};
}

export { CreateRolePermissionValidator, UpdateRolePermissionValidator };
