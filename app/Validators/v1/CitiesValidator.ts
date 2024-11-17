import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class CreateCityValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    name: schema.string(),
    state_id: schema.string({}, [rules.exists({ table: 'states', column: 'id' })]),
  });

  public messages = {};
}

export class UpdateCityValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    name: schema.string.optional(),
    state_id: schema.string.optional({}, [rules.exists({ table: 'states', column: 'id' })]),
  });

  public messages = {};
}
