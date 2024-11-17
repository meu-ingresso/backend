import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class CreateEventAttachmentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_id: schema.string({}, [rules.exists({ table: 'events', column: 'id' })]),
    name: schema.string(),
    type: schema.string.optional(),
    image_url: schema.string.optional(),
  });

  public messages = {};
}

export class UpdateEventAttachmentValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    event_id: schema.string.optional({}, [rules.exists({ table: 'events', column: 'id' })]),
    name: schema.string.optional(),
    type: schema.string.optional(),
    image_url: schema.string.optional(),
  });

  public messages = {};
}
