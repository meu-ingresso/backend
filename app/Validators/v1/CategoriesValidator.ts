import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateCategoryValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    name: schema.string(),
    description: schema.string.optional(),
    is_active: schema.boolean(),
  });

  public messages = {
    'name.required': 'O campo "name" é obrigatório.',
    'name.string': 'O campo "name" deve ser uma string válida.',
    'description.string': 'O campo "description" deve ser uma string válida.',
    'is_active.required': 'O campo "is_active" é obrigatório.',
    'is_active.boolean': 'O campo "is_active" deve ser um valor booleano.',
  };
}

class UpdateCategoryValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    name: schema.string.optional(),
    description: schema.string.optional(),
    is_active: schema.boolean.optional(),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.string': 'O campo "id" deve ser uma string válida.',
    'name.string': 'O campo "name" deve ser uma string válida.',
    'description.string': 'O campo "description" deve ser uma string válida.',
    'is_active.boolean': 'O campo "is_active" deve ser um valor booleano.',
  };
}

export { CreateCategoryValidator, UpdateCategoryValidator };
