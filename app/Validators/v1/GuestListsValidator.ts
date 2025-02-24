import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';
import Database from '@ioc:Adonis/Lucid/Database';

class CreateGuestListValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
        name: schema.string({}, [
          rules.maxLength(255),
          rules.unique({
            table: 'guest_lists',
            column: 'name',
            where: async (db, _, field) => {
              const index = parseInt(field.split('.')[1]);
              const eventId = this.context.request.input(`data.${index}.event_id`);

              const guestList = await Database.from('guest_lists').where('event_id', eventId).first();

              if (guestList) {
                db.where('event_id', eventId);
                db.whereNull('deleted_at');
              }
            },
          }),
        ]),
        created_by: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.event_id.required': 'O evento é obrigatório',
    'data.*.event_id.exists': 'O evento informado não existe',
    'data.*.name.required': 'O nome da lista é obrigatório',
    'data.*.name.maxLength': 'O nome da lista não pode ter mais que 255 caracteres',
    'data.*.name.unique': 'Já existe uma lista com este nome para este evento',
  };
}

class UpdateGuestListValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({}, [rules.exists({ table: 'guest_lists', column: 'id' })]),
        name: schema.string.optional({}, [
          rules.maxLength(255),
          rules.unique({
            table: 'guest_lists',
            column: 'name',
            where: async (db, _, field) => {
              const index = parseInt(field.split('.')[1]);
              const eventId = this.context.request.input(`data.${index}.event_id`);

              const guestList = await Database.from('guest_lists').where('event_id', eventId).first();

              if (guestList) {
                db.where('event_id', eventId);
                db.whereNull('deleted_at');
                db.whereNot('id', guestList.id);
              }
            },
          }),
        ]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.id.required': 'O ID da lista é obrigatório',
    'data.*.id.exists': 'A lista informada não existe',
    'data.*.name.maxLength': 'O nome da lista não pode ter mais que 255 caracteres',
    'data.*.name.unique': 'Já existe uma lista com este nome para este evento',
  };
}

export { CreateGuestListValidator, UpdateGuestListValidator };
