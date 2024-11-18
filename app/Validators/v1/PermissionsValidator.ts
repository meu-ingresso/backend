import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreatePermissionValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    name: schema.string({ trim: true }),
    description: schema.string.optional({ trim: true }),
  });

  public messages = {
    'name.required': 'O campo "name" é obrigatório.',
    'name.string': 'O campo "name" deve ser uma string válida.',
    'description.string': 'O campo "description" deve ser uma string válida.',
  };
}

class UpdatePermissionValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }),
    name: schema.string.optional({ trim: true }),
    description: schema.string.optional({ trim: true }),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.string': 'O campo "id" deve ser uma string válida.',
    'name.string': 'O campo "name" deve ser uma string válida.',
    'description.string': 'O campo "description" deve ser uma string válida.',
  };
}

export { CreatePermissionValidator, UpdatePermissionValidator };
