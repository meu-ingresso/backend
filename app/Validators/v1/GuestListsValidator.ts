import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';
import Database from '@ioc:Adonis/Lucid/Database';

class CreateGuestListValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
    name: schema.string({}, [
      rules.maxLength(255),
      rules.unique({
        table: 'guest_lists',
        column: 'name',
        where: {
          event_id: this.context.request.input('event_id'),
          deleted_at: null,
        },
      }),
    ]),
    created_by: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
  });

  public messages = {
    'event_id.required': 'O evento é obrigatório',
    'event_id.exists': 'O evento informado não existe',
    'name.required': 'O nome da lista é obrigatório',
    'name.maxLength': 'O nome da lista não pode ter mais que 255 caracteres',
    'name.unique': 'Já existe uma lista com este nome para este evento',
  };
}

class UpdateGuestListValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({}, [rules.exists({ table: 'guest_lists', column: 'id' })]),
    name: schema.string.optional({}, [
      rules.maxLength(255),
      rules.unique({
        table: 'guest_lists',
        column: 'name',
        whereNot: { id: this.context.request.input('id') },
        where: async (query) => {
          const guestList = await Database.from('guest_lists').where('id', this.context.request.input('id')).first();

          if (guestList) {
            query.where('event_id', guestList.event_id);
            query.whereNull('deleted_at');
          }
        },
      }),
    ]),
  });

  public messages = {
    'id.required': 'O ID da lista é obrigatório',
    'id.exists': 'A lista informada não existe',
    'name.maxLength': 'O nome da lista não pode ter mais que 255 caracteres',
    'name.unique': 'Já existe uma lista com este nome para este evento',
  };
}

export { CreateGuestListValidator, UpdateGuestListValidator };
