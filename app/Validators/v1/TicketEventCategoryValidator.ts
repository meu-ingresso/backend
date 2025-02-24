import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateTicketEventCategoryValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        event_id: schema.string({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
        name: schema.string({ trim: true }, [
          rules.unique({
            table: 'ticket_event_categories',
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
    'data.*.event_id.exists': 'O "event_id" fornecido não existe na tabela de eventos.',
    'data.*.name.required': 'O campo "name" é obrigatório.',
    'data.*.name.string': 'O campo "name" deve ser uma string válida.',
    'data.*.name.unique': 'Já existe uma categoria com este nome para este evento.',
  };
}

class UpdateTicketEventCategoryValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }, [rules.exists({ table: 'ticket_event_categories', column: 'id' })]),
        event_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
        name: schema.string.optional({ trim: true }, [
          rules.unique({
            table: 'ticket_event_categories',
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
    'data.*.id.exists': 'A categoria especificada não existe.',
    'data.*.event_id.exists': 'O evento especificado não existe.',
    'data.*.name.string': 'O campo "name" deve ser uma string válida.',
    'data.*.name.unique': 'Já existe uma categoria com este nome para este evento.',
  };
}

export { CreateTicketEventCategoryValidator, UpdateTicketEventCategoryValidator };
