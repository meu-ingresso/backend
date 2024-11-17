import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class CreateParameterValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    key: schema.string(),
    value: schema.string.optional(),
    description: schema.string.optional(),
  });

  public messages = {};
}

export class UpdateParameterValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    key: schema.string.optional(),
    value: schema.string.optional(),
    description: schema.string.optional(),
  });

  public messages = {};
}
