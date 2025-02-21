import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateGuestListMemberValidatedValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    guest_list_member_id: schema.string({}, [rules.exists({ table: 'guest_list_members', column: 'id' })]),
    quantity: schema.number([rules.unsigned(), rules.range(1, 99999)]),
  });

  public messages = {
    'guest_list_member_id.required': 'O convidado é obrigatório',
    'guest_list_member_id.exists': 'O convidado informado não existe',
    'quantity.required': 'A quantidade é obrigatória',
    'quantity.unsigned': 'A quantidade deve ser um número positivo',
  };
}

class UpdateGuestListMemberValidatedValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({}, [rules.exists({ table: 'guest_list_members_validated', column: 'id' })]),
    quantity: schema.number([rules.unsigned(), rules.range(1, 99999)]),
  });

  public messages = {
    'id.required': 'O ID do convidado é obrigatório',
    'id.exists': 'O convidado informado não existe',
    'first_name.maxLength': 'O nome não pode ter mais que 255 caracteres',
    'last_name.maxLength': 'O sobrenome não pode ter mais que 255 caracteres',
    'quantity.unsigned': 'A quantidade deve ser um número positivo',
  };
}

export { CreateGuestListMemberValidatedValidator, UpdateGuestListMemberValidatedValidator };
