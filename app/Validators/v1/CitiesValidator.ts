import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateCityValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    name: schema.string({ trim: true }),
    state_id: schema.string({}, [rules.exists({ table: 'states', column: 'id' })]),
  });

  public messages = {
    'name.required': 'O campo "name" é obrigatório.',
    'name.string': 'O campo "name" deve ser uma string válida.',
    'state_id.required': 'O campo "state_id" é obrigatório.',
    'state_id.string': 'O campo "state_id" deve ser uma string válida.',
    'state_id.exists': 'O "state_id" fornecido não existe na tabela de estados.',
  };
}
class UpdateCityValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({}, [rules.exists({ table: 'cities', column: 'id' })]),
    name: schema.string.optional({ trim: true }),
    state_id: schema.string.optional({}, [rules.exists({ table: 'states', column: 'id' })]),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.string': 'O campo "id" deve ser uma string válida.',
    'id.exists': 'O "id" fornecido não existe na tabela de cidades.',
    'name.string': 'O campo "name" deve ser uma string válida.',
    'state_id.string': 'O campo "state_id" deve ser uma string válida.',
    'state_id.exists': 'O "state_id" fornecido não existe na tabela de estados.',
  };
}

export { CreateCityValidator, UpdateCityValidator };
