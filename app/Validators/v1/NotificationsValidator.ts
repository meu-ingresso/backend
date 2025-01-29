import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateNotificationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }, [rules.required(), rules.maxLength(255)]),
    content: schema.string({ trim: true }, [rules.required()]),
    type: schema.enum(['admin_to_promoter', 'promoter_to_customer', 'admin_to_customer'] as const),
    status_id: schema.string([rules.required(), rules.exists({ table: 'statuses', column: 'id' })]),
    receiver_id: schema.string([rules.required(), rules.exists({ table: 'users', column: 'id' })]),
    sender_id: schema.string.optional([rules.exists({ table: 'users', column: 'id' })]),
  });

  public messages: CustomMessages = {
    'title.maxLength': 'O título não pode ter mais que 255 caracteres',
    'title.required': 'O título é obrigatório',
    'content.required': 'O conteúdo é obrigatório',
    'type.enum': 'O tipo deve ser admin_to_promoter, promoter_to_customer ou admin_to_customer',
    'status_id.exists': 'O status selecionado não existe',
    'receiver_id.exists': 'O usuário selecionado não existe',
    'sender_id.exists': 'O usuário selecionado não existe',
  };
}

class UpdateNotificationValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }, [rules.exists({ table: 'notifications', column: 'id' })]),
    title: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
    content: schema.string.optional({ trim: true }),
    type: schema.enum.optional(['admin_to_promoter', 'promoter_to_customer', 'admin_to_customer'] as const),
    status_id: schema.string.optional([rules.exists({ table: 'statuses', column: 'id' })]),
    receiver_id: schema.string.optional([rules.exists({ table: 'users', column: 'id' })]),
    read_at: schema.date.optional(),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.exists': 'O campo "id" deve existir na tabela de notificações.',
    'title.maxLength': 'O título não pode ter mais que 255 caracteres',
    'content.string': 'O campo "content" deve ser uma string válida.',
    'type.enum': 'O tipo deve ser admin_to_promoter, promoter_to_customer ou admin_to_customer',
    'status_id.exists': 'O status selecionado não existe',
    'receiver_id.exists': 'O usuário selecionado não existe',
    'read_at.date': 'O campo "read_at" deve ser uma data válida',
  };
}

export { CreateNotificationValidator, UpdateNotificationValidator };
