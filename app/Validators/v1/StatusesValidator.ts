import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateStatusValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        name: schema.string({ trim: true }, [
          rules.unique({
            table: 'statuses',
            column: 'name',
            where: async (db, _, field) => {
              const index = parseInt(field.split('.')[1]);
              const module = this.context.request.input(`data.${index}.module`);

              db.where('module', module).whereNull('deleted_at');
            },
          }),
        ]),
        module: schema.string({ trim: true }),
        description: schema.string.optional({ trim: true }),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.name.required': 'O campo "name" é obrigatório.',
    'data.*.name.string': 'O campo "name" deve ser uma string válida.',
    'data.*.name.unique': 'Já existe um status com este nome para este módulo.',
    'data.*.module.required': 'O campo "module" é obrigatório.',
    'data.*.module.string': 'O campo "module" deve ser uma string válida.',
    'data.*.description.string': 'O campo "description" deve ser uma string válida.',
  };
}

class UpdateStatusValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }, [rules.exists({ table: 'statuses', column: 'id' })]),
        name: schema.string.optional({ trim: true }, [
          rules.unique({
            table: 'statuses',
            column: 'name',
            where: {
              deleted_at: null,
              module: this.context.request.input('module'),
            },
            whereNot: (db, _, field) => {
              const index = parseInt(field.split('.')[1]);
              const id = this.context.request.input(`data.${index}.id`);
              db.whereNot('id', id);
            },
          }),
        ]),
        module: schema.string.optional({ trim: true }),
        description: schema.string.optional({ trim: true }),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O status especificado não existe.',
    'data.*.name.string': 'O campo "name" deve ser uma string válida.',
    'data.*.name.unique': 'Já existe um status com este nome para este módulo.',
    'data.*.module.string': 'O campo "module" deve ser uma string válida.',
    'data.*.description.string': 'O campo "description" deve ser uma string válida.',
  };
}

export { CreateStatusValidator, UpdateStatusValidator };
