import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateParameterValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    key: schema.string(),
    value: schema.string.optional(),
    description: schema.string.optional(),
  });

  public messages = {
    'key.required': 'O campo "key" é obrigatório.',
    'key.string': 'O campo "key" deve ser um texto válido.',
    'value.string': 'O campo "value" deve ser um texto válido.',
    'description.string': 'O campo "description" deve ser um texto válido.',
  };
}

class UpdateParameterValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    key: schema.string.optional(),
    value: schema.string.optional(),
    description: schema.string.optional(),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.string': 'O campo "id" deve ser um texto válido.',
    'key.string': 'O campo "key" deve ser um texto válido.',
    'value.string': 'O campo "value" deve ser um texto válido.',
    'description.string': 'O campo "description" deve ser um texto válido.',
  };
}

export { CreateParameterValidator, UpdateParameterValidator };
