import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateOpenAiValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    event_description: schema.string({ trim: true }),
  });

  public messages = {
    'event_description.required': 'O campo "event_description" é obrigatório.',
    'event_description.string': 'O campo "event_description" precisa ser uma string válida.',
  };
}

export { CreateOpenAiValidator };
