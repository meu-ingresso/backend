import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateParameterValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        key: schema.string({ trim: true }, [rules.unique({ table: 'parameters', column: 'key' })]),
        value: schema.string.optional({ trim: true }),
        description: schema.string.optional({ trim: true }),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.key.required': 'O campo "key" é obrigatório.',
    'data.*.key.unique': 'O campo "key" deve ser único.',
    'data.*.value.string': 'O campo "value" deve ser uma string válida.',
    'data.*.description.string': 'O campo "description" deve ser uma string válida.',
  };
}

class UpdateParameterValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }, [rules.exists({ table: 'parameters', column: 'id' })]),
        key: schema.string.optional({ trim: true }, [rules.unique({ table: 'parameters', column: 'key' })]),
        value: schema.string.optional({ trim: true }),
        description: schema.string.optional({ trim: true }),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O campo "id" deve existir na tabela de parâmetros.',
    'data.*.key.unique': 'O campo "key" deve ser único.',
    'data.*.value.string': 'O campo "value" deve ser uma string válida.',
    'data.*.description.string': 'O campo "description" deve ser uma string válida.',
  };
}

export { CreateParameterValidator, UpdateParameterValidator };
