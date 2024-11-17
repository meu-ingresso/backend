import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class CreateAddressValidator {
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
    state_id: schema.string({}, [rules.exists({ table: 'states', column: 'id' })]),
    city_id: schema.string({}, [rules.exists({ table: 'cities', column: 'id' })]),
  });

  public messages = {};
}

export class UpdateAddressValidator {
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
    state_id: schema.string.optional({}, [rules.exists({ table: 'states', column: 'id' })]),
    city_id: schema.string.optional({}, [rules.exists({ table: 'cities', column: 'id' })]),
  });

  public messages = {};
}
