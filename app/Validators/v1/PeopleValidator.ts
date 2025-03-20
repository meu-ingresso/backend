import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreatePeopleValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        person_type: schema.enum(['PF', 'PJ', 'ESTRANGEIRO']),
        first_name: schema.string({ trim: true }),
        last_name: schema.string({ trim: true }),
        social_name: schema.string.optional({ trim: true }),
        fantasy_name: schema.string.optional({ trim: true }),
        address_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'addresses', column: 'id' })]),
        tax: schema.string.optional({ trim: true }),
        birth_date: schema.date.optional({}, [rules.requiredWhen('person_type', '=', 'PF')]),
        phone: schema.string.optional({ trim: true }),
        email: schema.string({ trim: true }, [
          rules.email(),
          rules.unique({
            table: 'people',
            column: 'email',
            where: {
              deleted_at: null,
            },
          }),
        ]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.person_type.required': 'O campo "person_type" é obrigatório.',
    'data.*.person_type.enum': 'O campo "person_type" deve ser PF, PJ ou ESTRANGEIRO.',
    'data.*.first_name.required': 'O campo "first_name" é obrigatório.',
    'data.*.last_name.required': 'O campo "last_name" é obrigatório.',
    'data.*.birth_date.requiredWhen': 'O campo "birth_date" é obrigatório para pessoa física.',
    'data.*.email.required': 'O campo "email" é obrigatório.',
    'data.*.email.email': 'O campo "email" deve conter um endereço de e-mail válido.',
    'data.*.email.unique': 'O e-mail fornecido já está registrado.',
    'data.*.address_id.exists': 'O endereço informado não existe.',
  };
}

class UpdatePeopleValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }, [rules.exists({ table: 'people', column: 'id' })]),
        person_type: schema.enum.optional(['PF', 'PJ', 'ESTRANGEIRO']),
        first_name: schema.string.optional({ trim: true }),
        last_name: schema.string.optional({ trim: true }),
        social_name: schema.string.optional({ trim: true }),
        fantasy_name: schema.string.optional({ trim: true }),
        address_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'addresses', column: 'id' })]),
        tax: schema.string.optional({ trim: true }),
        birth_date: schema.date.optional(),
        phone: schema.string.optional({ trim: true }),
        email: schema.string.optional({ trim: true }, [
          rules.email(),
          rules.unique({
            table: 'people',
            column: 'email',
            where: {
              deleted_at: null,
            },
            whereNot: (db, _, field) => {
              const index = parseInt(field.split('.')[1]);
              const id = this.context.request.input(`data.${index}.id`);
              db.whereNot('id', id);
            },
          }),
        ]),
      })
    ),
  });

  public messages = {
    'data.required': 'O campo "data" é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.id.exists': 'O campo "id" não existe.',
    'data.*.person_type.enum': 'O campo "person_type" deve ser PF, PJ ou ESTRANGEIRO.',
    'data.*.email.email': 'O campo "email" deve conter um endereço de e-mail válido.',
    'data.*.email.unique': 'O e-mail fornecido já está registrado.',
    'data.*.address_id.exists': 'O endereço informado não existe.',
  };
}

export { CreatePeopleValidator, UpdatePeopleValidator };
