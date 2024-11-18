import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateRoleValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    name: schema.string({ trim: true }),
  });

  public messages = {
    'name.required': 'O campo "name" é obrigatório.',
    'name.string': 'O campo "name" deve ser uma string válida.',
  };
}

class UpdateRoleValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }),
    name: schema.string.optional({ trim: true }),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.string': 'O campo "id" deve ser uma string válida.',
    'name.string': 'O campo "name" deve ser uma string válida.',
  };
}

export { CreateRoleValidator, UpdateRoleValidator };
