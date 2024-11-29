import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventAttachmentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
    name: schema.string({ trim: true }, [rules.maxLength(255)]),
    type: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
    image_url: schema.string.optional({ trim: true }, [rules.url(), rules.maxLength(255)]),
  });

  public messages = {
    'event_id.required': 'O campo "event_id" é obrigatório.',
    'event_id.exists': 'O "event_id" fornecido não existe na tabela de eventos.',
    'name.required': 'O campo "name" é obrigatório.',
    'name.maxLength': 'O campo "name" deve ter no máximo 255 caracteres.',
    'type.maxLength': 'O campo "type" deve ter no máximo 50 caracteres.',
    'image_url.url': 'O campo "image_url" deve ser uma URL válida.',
    'image_url.maxLength': 'O campo "image_url" deve ter no máximo 255 caracteres.',
  };
}

class UpdateEventAttachmentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }, [rules.exists({ table: 'event_attachments', column: 'id' })]),
    event_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'events', column: 'id' })]),
    name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
    type: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
    image_url: schema.string.optional({ trim: true }, [rules.url(), rules.maxLength(255)]),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.exists': 'O "id" fornecido não existe na tabela de anexos.',
    'event_id.exists': 'O "event_id" fornecido não existe na tabela de eventos.',
    'name.maxLength': 'O campo "name" deve ter no máximo 255 caracteres.',
    'type.maxLength': 'O campo "type" deve ter no máximo 50 caracteres.',
    'image_url.url': 'O campo "image_url" deve ser uma URL válida.',
    'image_url.maxLength': 'O campo "image_url" deve ter no máximo 255 caracteres.',
  };
}

export { CreateEventAttachmentValidator, UpdateEventAttachmentValidator };
