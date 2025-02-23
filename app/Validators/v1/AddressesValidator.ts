import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateAddressValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        street: schema.string({ trim: true }),
        zipcode: schema.string({ trim: true }),
        number: schema.string.optional({ trim: true }),
        complement: schema.string.optional({ trim: true }),
        neighborhood: schema.string({ trim: true }),
        latitude: schema.number.optional(),
        longitude: schema.number.optional(),
        city: schema.string({ trim: true }),
        state: schema.string({ trim: true }),
      })
    ),
  });

  public messages = {
    'data.required': 'O array de endereços é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.street.required': 'O campo "street" é obrigatório.',
    'data.*.zipcode.required': 'O campo "zipcode" é obrigatório.',
    'data.*.neighborhood.required': 'O campo "neighborhood" é obrigatório.',
    'data.*.city.required': 'O campo "city" é obrigatório.',
    'data.*.city.string': 'O campo "city" deve ser uma string.',
    'data.*.state.required': 'O campo "state" é obrigatório.',
    'data.*.state.string': 'O campo "state" deve ser uma string.',
    'data.*.latitude.number': 'O campo "latitude" deve ser um número válido.',
    'data.*.longitude.number': 'O campo "longitude" deve ser um número válido.',
  };
}

class UpdateAddressValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    data: schema.array().members(
      schema.object().members({
        id: schema.string({ trim: true }),
        street: schema.string.optional({ trim: true }),
        zipcode: schema.string.optional({ trim: true }),
        number: schema.string.optional({ trim: true }),
        complement: schema.string.optional({ trim: true }),
        neighborhood: schema.string.optional({ trim: true }),
        latitude: schema.number.optional(),
        longitude: schema.number.optional(),
        city: schema.string.optional({ trim: true }),
        state: schema.string.optional({ trim: true }),
      })
    ),
  });

  public messages = {
    'data.required': 'O array de endereços é obrigatório.',
    'data.array': 'O campo data deve ser um array.',
    'data.*.id.required': 'O campo "id" é obrigatório.',
    'data.*.city.string': 'O campo "city" deve ser uma string.',
    'data.*.state.string': 'O campo "state" deve ser uma string.',
    'data.*.latitude.number': 'O campo "latitude" deve ser um número válido.',
    'data.*.longitude.number': 'O campo "longitude" deve ser um número válido.',
  };
}

export { CreateAddressValidator, UpdateAddressValidator };
