import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class GoogleAuthValidator {
    constructor(protected context: HttpContextContract) {}
  
    public reporter = ReportHandler;
  
    public schema = schema.create({
      google_id: schema.string({}, [rules.required()]),
      name: schema.string({}, [rules.required()]),
      given_name: schema.string({}, [rules.required()]),
      family_name: schema.string({}, [rules.required()]),
      email: schema.string({}, [rules.email(), rules.required()]),
      picture: schema.string({}, [rules.url()]),
      email_verified: schema.boolean(),
      provider: schema.string({}, [rules.required()]),
    });
  
    public messages = {
      'google_id.required': 'O ID do Google é obrigatório.',
      'name.required': 'O nome é obrigatório.',
      'given_name.required': 'O primeiro nome é obrigatório.',
      'family_name.required': 'O sobrenome é obrigatório.',
      'email.required': 'O email é obrigatório.',
      'email.email': 'O email deve ser válido.',
      'picture.url': 'A URL da foto deve ser válida.',
      'provider.required': 'O provedor é obrigatório.',
    };
}