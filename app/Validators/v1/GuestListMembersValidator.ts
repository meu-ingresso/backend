import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateGuestListMemberValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        guest_list_id: schema.string({}, [rules.exists({ table: 'guest_lists', column: 'id' })]),
        first_name: schema.string({}, [rules.maxLength(255)]),
        last_name: schema.string.optional({}, [rules.maxLength(255)]),
        quantity: schema.number([rules.unsigned(), rules.range(1, 99999)]),
        added_by: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.guest_list_id.required': 'A lista de convidados é obrigatória',
    'data.*.guest_list_id.exists': 'A lista informada não existe',
    'data.*.first_name.required': 'O nome é obrigatório',
    'data.*.first_name.maxLength': 'O nome não pode ter mais que 255 caracteres',
    'data.*.last_name.maxLength': 'O sobrenome não pode ter mais que 255 caracteres',
    'data.*.quantity.required': 'A quantidade é obrigatória',
    'data.*.quantity.unsigned': 'A quantidade deve ser um número positivo',
  };
}

class UpdateGuestListMemberValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({}, [rules.exists({ table: 'guest_list_members', column: 'id' })]),
        first_name: schema.string.optional({}, [rules.maxLength(255)]),
        last_name: schema.string.optional({}, [rules.maxLength(255)]),
        quantity: schema.number.optional([rules.unsigned(), rules.range(1, 99999)]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.id.required': 'O ID do convidado é obrigatório',
    'data.*.id.exists': 'O convidado informado não existe',
    'data.*.first_name.maxLength': 'O nome não pode ter mais que 255 caracteres',
    'data.*.last_name.maxLength': 'O sobrenome não pode ter mais que 255 caracteres',
    'data.*.quantity.unsigned': 'A quantidade deve ser um número positivo',
  };
}

export { CreateGuestListMemberValidator, UpdateGuestListMemberValidator };
