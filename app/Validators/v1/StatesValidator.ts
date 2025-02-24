import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateStateValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        name: schema.string({ trim: true }, [
          rules.unique({
            table: 'states',
            column: 'name',
            where: {
              deleted_at: null,
            },
          }),
        ]),
        acronym: schema.string({ trim: true }, [
          rules.unique({
            table: 'states',
            column: 'acronym',
            where: {
              deleted_at: null,
            },
          }),
        ]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.name.required': 'O campo "name" é obrigatório.',
    'data.*.name.string': 'O campo "name" deve ser uma string válida.',
    'data.*.name.unique': 'Já existe um estado com este nome.',
    'data.*.acronym.required': 'O campo "acronym" é obrigatório.',
    'data.*.acronym.string': 'O campo "acronym" deve ser uma string válida.',
    'data.*.acronym.unique': 'Já existe um estado com esta sigla.',
  };
}

class UpdateStateValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }, [rules.exists({ table: 'states', column: 'id' })]),
        name: schema.string.optional({ trim: true }, [
          rules.unique({
            table: 'states',
            column: 'name',
            where: {
              deleted_at: null,
            },
            whereNot: (db, _, field) => {
              const index = parseInt(field.split('.')[1]);
              const id = this.context.request.input(`data.${index}.id`);
              db.whereNot('id', id);
            },
          }),
        ]),
        acronym: schema.string.optional({ trim: true }, [
          rules.unique({
            table: 'states',
            column: 'acronym',
            where: {
              deleted_at: null,
            },
            whereNot: (db, _, field) => {
              const index = parseInt(field.split('.')[1]);
              const id = this.context.request.input(`data.${index}.id`);
              db.whereNot('id', id);
            },
          }),
        ]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O estado especificado não existe.',
    'data.*.name.string': 'O campo "name" deve ser uma string válida.',
    'data.*.name.unique': 'Já existe um estado com este nome.',
    'data.*.acronym.string': 'O campo "acronym" deve ser uma string válida.',
    'data.*.acronym.unique': 'Já existe um estado com esta sigla.',
  };
}

export { CreateStateValidator, UpdateStateValidator };
