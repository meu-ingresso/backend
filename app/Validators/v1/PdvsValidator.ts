import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreatePdvValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
    status_id: schema.string({}, [rules.exists({ table: 'statuses', column: 'id' })]),
    name: schema.string({}, [
      rules.unique({
        table: 'pdvs',
        column: 'name',
        where: {
          event_id: this.context.request.input('event_id'),
          deleted_at: null,
        },
      }),
    ]),
  });

  public messages = {
    'event_id.required': 'O campo "event_id" é obrigatório.',
    'event_id.exists': 'O evento especificado não existe.',
    'status_id.required': 'O campo "status_id" é obrigatório.',
    'status_id.exists': 'O status especificado não existe.',
    'name.required': 'O campo "name" é obrigatório.',
  };
}

class UpdatePdvValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({}, [rules.exists({ table: 'pdvs', column: 'id' })]),
    event_id: schema.string.optional({}, [rules.exists({ table: 'events', column: 'id' })]),
    status_id: schema.string.optional({}, [rules.exists({ table: 'statuses', column: 'id' })]),
    name: schema.string.optional({}, [
      rules.unique({
        table: 'pdvs',
        column: 'name',
        whereNot: { id: this.context.request.input('id') },
        where: {
          event_id: this.context.request.input('event_id'),
          deleted_at: null,
        },
      }),
    ]),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.exists': 'O pdv especificado não existe.',
    'event_id.exists': 'O evento especificado não existe.',
    'status_id.exists': 'O status especificado não existe.',
    'name.required': 'O campo "name" é obrigatório.',
  };
}

export { CreatePdvValidator, UpdatePdvValidator };
