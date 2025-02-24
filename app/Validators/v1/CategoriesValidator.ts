import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateCategoryValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        name: schema.string(),
        description: schema.string.optional(),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.name.required': 'O campo "name" é obrigatório.',
    'data.*.name.string': 'O campo "name" deve ser uma string válida.',
    'data.*.description.string': 'O campo "description" deve ser uma string válida.',
  };
}

class UpdateCategoryValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string(),
        name: schema.string.optional(),
        description: schema.string.optional(),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.string': 'O campo "id" deve ser uma string válida.',
    'data.*.name.string': 'O campo "name" deve ser uma string válida.',
    'data.*.description.string': 'O campo "description" deve ser uma string válida.',
  };
}

export { CreateCategoryValidator, UpdateCategoryValidator };
