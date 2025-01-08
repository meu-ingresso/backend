import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateRatingValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    name: schema.string(),
    description: schema.string.optional(),
    image: schema.string.optional(),
  });

  public messages = {
    'name.required': 'O campo "name" é obrigatório.',
    'name.string': 'O campo "name" deve ser uma string válida.',
    'description.string': 'O campo "description" deve ser uma string válida.',
    'image.string': 'O campo "image" deve ser uma string válida.',
  };
}

class UpdateRatingValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    name: schema.string.optional(),
    description: schema.string.optional(),
    image: schema.string.optional(),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.string': 'O campo "id" deve ser uma string válida.',
    'name.string': 'O campo "name" deve ser uma string válida.',
    'description.string': 'O campo "description" deve ser uma string válida.',
    'image.string': 'O campo "image" deve ser uma string válida.',
  };
}

export { CreateRatingValidator, UpdateRatingValidator };
