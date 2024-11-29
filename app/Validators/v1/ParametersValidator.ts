import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateParameterValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    key: schema.string({ trim: true }, [rules.unique({ table: 'parameters', column: 'key' })]),
    value: schema.string.optional({ trim: true }),
    description: schema.string.optional({ trim: true }),
  });

  public messages = {
    'key.required': 'O campo "key" é obrigatório.',
    'key.unique': 'O campo "key" deve ser único.',
    'value.string': 'O campo "value" deve ser uma string válida.',
    'description.string': 'O campo "description" deve ser uma string válida.',
  };
}

class UpdateParameterValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }, [rules.exists({ table: 'parameters', column: 'id' })]),
    key: schema.string.optional({ trim: true }, [rules.unique({ table: 'parameters', column: 'key' })]),
    value: schema.string.optional({ trim: true }),
    description: schema.string.optional({ trim: true }),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.exists': 'O campo "id" deve existir na tabela de parâmetros.',
    'key.unique': 'O campo "key" deve ser único.',
    'value.string': 'O campo "value" deve ser uma string válida.',
    'description.string': 'O campo "description" deve ser uma string válida.',
  };
}

export { CreateParameterValidator, UpdateParameterValidator };
