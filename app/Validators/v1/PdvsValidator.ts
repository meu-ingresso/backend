import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreatePdvValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
        status_id: schema.string({}, [rules.exists({ table: 'statuses', column: 'id' })]),
        name: schema.string({}, [
          rules.unique({
            table: 'pdvs',
            column: 'name',
            where: async (db, _, field) => {
              const index = parseInt(field.split('.')[1]);
              const eventId = this.context.request.input(`data.${index}.event_id`);

              db.where('event_id', eventId).whereNull('deleted_at');
            },
          }),
        ]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.event_id.required': 'O campo "event_id" é obrigatório.',
    'data.*.event_id.exists': 'O evento especificado não existe.',
    'data.*.status_id.required': 'O campo "status_id" é obrigatório.',
    'data.*.status_id.exists': 'O status especificado não existe.',
    'data.*.name.required': 'O campo "name" é obrigatório.',
    'data.*.name.unique': 'Já existe um PDV com este nome para o mesmo evento.',
  };
}

class UpdatePdvValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({}, [rules.exists({ table: 'pdvs', column: 'id' })]),
        event_id: schema.string.optional({}, [rules.exists({ table: 'events', column: 'id' })]),
        status_id: schema.string.optional({}, [rules.exists({ table: 'statuses', column: 'id' })]),
        name: schema.string.optional({}, [
          rules.unique({
            table: 'pdvs',
            column: 'name',
            where: async (db, _, field) => {
              const index = parseInt(field.split('.')[1]);
              const eventId = this.context.request.input(`data.${index}.event_id`);

              db.where('event_id', eventId).whereNull('deleted_at');
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
    'data.*.id.exists': 'O pdv especificado não existe.',
    'data.*.event_id.exists': 'O evento especificado não existe.',
    'data.*.status_id.exists': 'O status especificado não existe.',
    'data.*.name.unique': 'Já existe um PDV com este nome para o mesmo evento.',
  };
}

export { CreatePdvValidator, UpdatePdvValidator };
