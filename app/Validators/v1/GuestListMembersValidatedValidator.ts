import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateGuestListMemberValidatedValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        guest_list_member_id: schema.string({}, [rules.exists({ table: 'guest_list_members', column: 'id' })]),
        quantity: schema.number([rules.unsigned(), rules.range(1, 99999)]),
        validated_by: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.guest_list_member_id.required': 'O convidado é obrigatório',
    'data.*.guest_list_member_id.exists': 'O convidado informado não existe',
    'data.*.quantity.required': 'A quantidade é obrigatória',
    'data.*.quantity.unsigned': 'A quantidade deve ser um número positivo',
    'data.*.validated_by.exists': 'O usuário informado não existe',
  };
}

class UpdateGuestListMemberValidatedValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({}, [rules.exists({ table: 'guest_list_members_validated', column: 'id' })]),
        quantity: schema.number.optional([rules.unsigned(), rules.range(1, 99999)]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo "data" deve ser um array.',
    'data.*.id.required': 'O ID do registro é obrigatório',
    'data.*.id.exists': 'O registro informado não existe',
    'data.*.quantity.unsigned': 'A quantidade deve ser um número positivo',
  };
}

export { CreateGuestListMemberValidatedValidator, UpdateGuestListMemberValidatedValidator };
