import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateGuestListMemberValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    guest_list_id: schema.string({}, [rules.exists({ table: 'guest_lists', column: 'id' })]),
    first_name: schema.string({}, [rules.maxLength(255)]),
    last_name: schema.string.optional({}, [rules.maxLength(255)]),
    quantity: schema.number([rules.unsigned(), rules.range(1, 99999)]),
  });

  public messages = {
    'guest_list_id.required': 'A lista de convidados é obrigatória',
    'guest_list_id.exists': 'A lista informada não existe',
    'first_name.required': 'O nome é obrigatório',
    'first_name.maxLength': 'O nome não pode ter mais que 255 caracteres',
    'last_name.maxLength': 'O sobrenome não pode ter mais que 255 caracteres',
    'quantity.required': 'A quantidade é obrigatória',
    'quantity.unsigned': 'A quantidade deve ser um número positivo',
    'quantity.range': 'A quantidade deve estar entre 1 e 99999',
  };
}

class UpdateGuestListMemberValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({}, [rules.exists({ table: 'guest_list_members', column: 'id' })]),
    first_name: schema.string.optional({}, [rules.maxLength(255)]),
    last_name: schema.string.optional({}, [rules.maxLength(255)]),
    quantity: schema.number.optional([rules.unsigned(), rules.range(1, 99999)]),
  });

  public messages = {
    'id.required': 'O ID do convidado é obrigatório',
    'id.exists': 'O convidado informado não existe',
    'first_name.maxLength': 'O nome não pode ter mais que 255 caracteres',
    'last_name.maxLength': 'O sobrenome não pode ter mais que 255 caracteres',
    'quantity.unsigned': 'A quantidade deve ser um número positivo',
    'quantity.range': 'A quantidade deve estar entre 1 e 99999',
  };
}

export { CreateGuestListMemberValidator, UpdateGuestListMemberValidator };
