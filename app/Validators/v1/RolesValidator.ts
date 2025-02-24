import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateRoleValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        name: schema.string({ trim: true }, [
          rules.unique({
            table: 'roles',
            column: 'name',
            where: {
              deleted_at: null,
            },
          }),
        ]),
        description: schema.string({ trim: true }),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.name.required': 'O campo "name" é obrigatório.',
    'data.*.name.string': 'O campo "name" deve ser uma string válida.',
    'data.*.name.unique': 'Já existe um papel com este nome.',
    'data.*.description.required': 'O campo "description" é obrigatório.',
    'data.*.description.string': 'O campo "description" deve ser uma string válida.',
  };
}

class UpdateRoleValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }, [rules.exists({ table: 'roles', column: 'id' })]),
        name: schema.string.optional({ trim: true }, [
          rules.unique({
            table: 'roles',
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
        description: schema.string.optional({ trim: true }),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O papel especificado não existe.',
    'data.*.name.string': 'O campo "name" deve ser uma string válida.',
    'data.*.name.unique': 'Já existe um papel com este nome.',
    'data.*.description.string': 'O campo "description" deve ser uma string válida.',
  };
}

export { CreateRoleValidator, UpdateRoleValidator };
