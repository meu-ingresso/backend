import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateUserAttachmentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        user_id: schema.string({ trim: true }, [
          rules.exists({
            table: 'users',
            column: 'id',
            where: { deleted_at: null },
          }),
        ]),
        name: schema.string({ trim: true }, [rules.maxLength(255)]),
        type: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
        value: schema.string.optional({ trim: true }, [rules.maxLength(2048)]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.user_id.required': 'O campo "user_id" é obrigatório.',
    'data.*.user_id.exists': 'O "user_id" fornecido não existe na tabela de usuários.',
    'data.*.name.required': 'O campo "name" é obrigatório.',
    'data.*.name.maxLength': 'O campo "name" deve ter no máximo 255 caracteres.',
    'data.*.type.maxLength': 'O campo "type" deve ter no máximo 50 caracteres.',
    'data.*.value.maxLength': 'O campo "value" deve ter no máximo 2048 caracteres.',
  };
}

class UpdateUserAttachmentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }, [
          rules.exists({
            table: 'user_attachments',
            column: 'id',
            where: { deleted_at: null },
          }),
        ]),
        user_id: schema.string.optional({ trim: true }, [
          rules.exists({
            table: 'users',
            column: 'id',
            where: { deleted_at: null },
          }),
        ]),
        name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
        type: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
        value: schema.string.optional({ trim: true }, [rules.maxLength(2048)]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O anexo não existe ou foi removido.',
    'data.*.user_id.exists': 'O "user_id" fornecido não existe na tabela de usuários.',
    'data.*.name.maxLength': 'O campo "name" deve ter no máximo 255 caracteres.',
    'data.*.type.maxLength': 'O campo "type" deve ter no máximo 50 caracteres.',
    'data.*.value.maxLength': 'O campo "value" deve ter no máximo 2048 caracteres.',
  };
}

export { CreateUserAttachmentValidator, UpdateUserAttachmentValidator };
