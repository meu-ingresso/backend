import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateAddressValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    street: schema.string(),
    zipcode: schema.string(),
    number: schema.string.optional(),
    complement: schema.string.optional(),
    neighborhood: schema.string(),
    latitude: schema.number.optional(),
    longitude: schema.number.optional(),
    city: schema.string(),
    state: schema.string(),
  });

  public messages = {
    'street.required': 'O campo "street" é obrigatório.',
    'zipcode.required': 'O campo "zipcode" é obrigatório.',
    'neighborhood.required': 'O campo "neighborhood" é obrigatório.',
    'city.required': 'O campo "city" é obrigatório.',
    'city.string': 'O campo "city" deve ser uma string.',
    'state.required': 'O campo "state" é obrigatório.',
    'state.string': 'O campo "state" deve ser uma string.',
    'latitude.number': 'O campo "latitude" deve ser um número válido.',
    'longitude.number': 'O campo "longitude" deve ser um número válido.',
  };
}

class UpdateAddressValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    street: schema.string.optional(),
    zipcode: schema.string.optional(),
    number: schema.string.optional(),
    complement: schema.string.optional(),
    neighborhood: schema.string.optional(),
    latitude: schema.number.optional(),
    longitude: schema.number.optional(),
    city: schema.string.optional(),
    state: schema.string.optional(),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'city.string': 'O campo "city" deve ser uma string.',
    'state.string': 'O campo "state" deve ser uma string.',
    'latitude.number': 'O campo "latitude" deve ser um número válido.',
    'longitude.number': 'O campo "longitude" deve ser um número válido.',
  };
}

export { CreateAddressValidator, UpdateAddressValidator };
