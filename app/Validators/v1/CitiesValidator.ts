import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateCityValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        name: schema.string({ trim: true }),
        state_id: schema.string({}, [rules.exists({ table: 'states', column: 'id' })]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.name.required': 'O campo "name" é obrigatório.',
    'data.*.name.string': 'O campo "name" deve ser uma string válida.',
    'data.*.state_id.required': 'O campo "state_id" é obrigatório.',
    'data.*.state_id.string': 'O campo "state_id" deve ser uma string válida.',
    'data.*.state_id.exists': 'O "state_id" fornecido não existe na tabela de estados.',
  };
}

class UpdateCityValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({}, [rules.exists({ table: 'cities', column: 'id' })]),
        name: schema.string.optional({ trim: true }),
        state_id: schema.string.optional({}, [rules.exists({ table: 'states', column: 'id' })]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.string': 'O campo "id" deve ser uma string válida.',
    'data.*.id.exists': 'O "id" fornecido não existe na tabela de cidades.',
    'data.*.name.string': 'O campo "name" deve ser uma string válida.',
    'data.*.state_id.string': 'O campo "state_id" deve ser uma string válida.',
    'data.*.state_id.exists': 'O "state_id" fornecido não existe na tabela de estados.',
  };
}

export { CreateCityValidator, UpdateCityValidator };
