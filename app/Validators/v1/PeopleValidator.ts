import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreatePeopleValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    person_type: schema.enum(['PF', 'PJ', 'ESTRANGEIRO']),
    first_name: schema.string({ trim: true }),
    last_name: schema.string({ trim: true }),
    tax: schema.string.optional({ trim: true }),
    birth_date: schema.date.optional({}, [rules.requiredWhen('person_type', '=', 'PF')]),
    phone: schema.string.optional({ trim: true }),
    email: schema.string({ trim: true }, [rules.email(), rules.unique({ table: 'people', column: 'email' })]),
  });

  public messages = {
    'person_type.required': 'O campo "person_type" é obrigatório.',
    'person_type.enum': 'O campo "person_type" deve ser PF, PJ ou ESTRANGEIRO.',
    'first_name.required': 'O campo "first_name" é obrigatório.',
    'last_name.required': 'O campo "last_name" é obrigatório.',
    'birth_date.requiredWhen': 'O campo "birth_date" é obrigatório para pessoa física.',
    'email.required': 'O campo "email" é obrigatório.',
    'email.email': 'O campo "email" deve conter um endereço de e-mail válido.',
    'email.unique': 'O e-mail fornecido já está registrado.',
  };
}

class UpdatePeopleValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }),
    person_type: schema.enum.optional(['PF', 'PJ', 'ESTRANGEIRO']),
    first_name: schema.string.optional({ trim: true }),
    last_name: schema.string.optional({ trim: true }),
    tax: schema.string.optional({ trim: true }),
    birth_date: schema.date.optional(),
    phone: schema.string.optional({ trim: true }),
    email: schema.string.optional({ trim: true }, [rules.email()]),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.exists': 'O campo "id" não existe.',
    'person_type.enum': 'O campo "person_type" deve ser PF, PJ ou ESTRANGEIRO.',
    'email.email': 'O campo "email" deve conter um endereço de e-mail válido.',
  };
}

export { CreatePeopleValidator, UpdatePeopleValidator };
