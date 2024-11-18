import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateStateValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    name: schema.string({ trim: true }),
    acronym: schema.string({ trim: true }),
  });

  public messages = {
    'name.required': 'O campo "name" é obrigatório.',
    'name.string': 'O campo "name" deve ser uma string válida.',
    'acronym.required': 'O campo "acronym" é obrigatório.',
    'acronym.string': 'O campo "acronym" deve ser uma string válida.',
  };
}

class UpdateStateValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }),
    name: schema.string.optional({ trim: true }),
    acronym: schema.string.optional({ trim: true }),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.string': 'O campo "id" deve ser uma string válida.',
    'name.string': 'O campo "name" deve ser uma string válida.',
    'acronym.string': 'O campo "acronym" deve ser uma string válida.',
  };
}

export { CreateStateValidator, UpdateStateValidator };
