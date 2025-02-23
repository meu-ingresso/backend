import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventAttachmentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        event_id: schema.string({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
        name: schema.string({ trim: true }, [rules.maxLength(255)]),
        type: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
        url: schema.string.optional({ trim: true }, [rules.url(), rules.maxLength(255)]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.event_id.required': 'O campo "event_id" é obrigatório.',
    'data.*.event_id.exists': 'O "event_id" fornecido não existe na tabela de eventos.',
    'data.*.name.required': 'O campo "name" é obrigatório.',
    'data.*.name.maxLength': 'O campo "name" deve ter no máximo 255 caracteres.',
    'data.*.type.maxLength': 'O campo "type" deve ter no máximo 50 caracteres.',
    'data.*.url.url': 'O campo "url" deve ser uma URL válida.',
    'data.*.url.maxLength': 'O campo "url" deve ter no máximo 255 caracteres.',
  };
}

class UpdateEventAttachmentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }, [rules.exists({ table: 'event_attachments', column: 'id' })]),
        event_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
        name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
        type: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
        url: schema.string.optional({ trim: true }, [rules.url(), rules.maxLength(255)]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O "id" fornecido não existe na tabela de anexos.',
    'data.*.event_id.exists': 'O "event_id" fornecido não existe na tabela de eventos.',
    'data.*.name.maxLength': 'O campo "name" deve ter no máximo 255 caracteres.',
    'data.*.type.maxLength': 'O campo "type" deve ter no máximo 50 caracteres.',
    'data.*.url.url': 'O campo "url" deve ser uma URL válida.',
    'data.*.url.maxLength': 'O campo "url" deve ter no máximo 255 caracteres.',
  };
}

export { CreateEventAttachmentValidator, UpdateEventAttachmentValidator };
