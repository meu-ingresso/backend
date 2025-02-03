import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateUserAttachmentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    user_id: schema.string({ trim: true }, [rules.exists({ table: 'users', column: 'id' })]),
    name: schema.string({ trim: true }, [rules.maxLength(255)]),
    type: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
    url: schema.string.optional({ trim: true }, [rules.url(), rules.maxLength(255)]),
  });

  public messages = {
    'user_id.required': 'O campo "user_id" é obrigatório.',
    'user_id.exists': 'O "user_id" fornecido não existe na tabela de usuários.',
    'name.required': 'O campo "name" é obrigatório.',
    'name.maxLength': 'O campo "name" deve ter no máximo 255 caracteres.',
    'type.maxLength': 'O campo "type" deve ter no máximo 50 caracteres.',
    'url.url': 'O campo "url" deve ser uma URL válida.',
    'url.maxLength': 'O campo "url" deve ter no máximo 255 caracteres.',
  };
}

class UpdateUserAttachmentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }, [rules.exists({ table: 'user_attachments', column: 'id' })]),
    user_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'users', column: 'id' })]),
    name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
    type: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
    url: schema.string.optional({ trim: true }, [rules.url(), rules.maxLength(255)]),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.exists': 'O "id" fornecido não existe na tabela de anexos.',
    'user_id.exists': 'O "user_id" fornecido não existe na tabela de usuários.',
    'name.maxLength': 'O campo "name" deve ter no máximo 255 caracteres.',
    'type.maxLength': 'O campo "type" deve ter no máximo 50 caracteres.',
    'url.url': 'O campo "url" deve ser uma URL válida.',
    'url.maxLength': 'O campo "url" deve ter no máximo 255 caracteres.',
  };
}

export { CreateUserAttachmentValidator, UpdateUserAttachmentValidator };
