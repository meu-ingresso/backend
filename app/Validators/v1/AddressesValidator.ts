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
    city_id: schema.string({}, [rules.exists({ table: 'cities', column: 'id' })]),
  });

  public messages = {
    'street.required': 'O campo "street" é obrigatório.',
    'zipcode.required': 'O campo "zipcode" é obrigatório.',
    'neighborhood.required': 'O campo "neighborhood" é obrigatório.',
    'city_id.required': 'O campo "city_id" é obrigatório.',
    'city_id.exists': 'O "city_id" informado não existe na tabela de cidades.',
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
    city_id: schema.string.optional({}, [rules.exists({ table: 'cities', column: 'id' })]),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'city_id.exists': 'O "city_id" informado não existe na tabela de cidades.',
    'latitude.number': 'O campo "latitude" deve ser um número válido.',
    'longitude.number': 'O campo "longitude" deve ser um número válido.',
  };
}

export { CreateAddressValidator, UpdateAddressValidator };
