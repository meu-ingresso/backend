import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventGroupRelationValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        event_id: schema.string({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
        group_id: schema.string({ trim: true }, [rules.exists({ table: 'event_groups', column: 'id' })]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.event_id.required': 'O campo "event_id" é obrigatório.',
    'data.*.event_id.exists': 'O evento especificado não foi encontrado.',
    'data.*.group_id.required': 'O campo "group_id" é obrigatório.',
    'data.*.group_id.exists': 'O grupo especificado não foi encontrado.',
  };
}

export { CreateEventGroupRelationValidator };
