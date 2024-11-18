import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

class CreateEventValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    name: schema.string(),
    description: schema.string.optional(),
    status_id: schema.string({}, [rules.exists({ table: 'statuses', column: 'id' })]),
    address_id: schema.string.optional({}, [rules.exists({ table: 'addresses', column: 'id' })]),
    category_id: schema.string.optional({}, [rules.exists({ table: 'categories', column: 'id' })]),
    rating_id: schema.string.optional({}, [rules.exists({ table: 'ratings', column: 'id' })]),
    start_date: schema.date(),
    end_date: schema.date.optional(),
    opening_hour: schema.string.optional(),
    contact: schema.string.optional(),
    location_name: schema.string.optional(),
    general_information: schema.string.optional(),
    house_map: schema.string.optional(),
    max_capacity: schema.number.optional(),
    promoter_id: schema.string({}, [rules.exists({ table: 'users', column: 'id' })]),
  });

  public messages = {
    'name.required': 'O campo "name" é obrigatório.',
    'name.string': 'O campo "name" deve ser uma string válida.',
    'description.string': 'O campo "description" deve ser uma string válida.',
    'status_id.required': 'O campo "status_id" é obrigatório.',
    'status_id.string': 'O campo "status_id" deve ser uma string válida.',
    'status_id.exists': 'O "status_id" fornecido não existe.',
    'address_id.string': 'O campo "address_id" deve ser uma string válida.',
    'address_id.exists': 'O "address_id" fornecido não existe.',
    'category_id.string': 'O campo "category_id" deve ser uma string válida.',
    'category_id.exists': 'O "category_id" fornecido não existe.',
    'rating_id.string': 'O campo "rating_id" deve ser uma string válida.',
    'rating_id.exists': 'O "rating_id" fornecido não existe.',
    'start_date.required': 'O campo "start_date" é obrigatório.',
    'start_date.date': 'O campo "start_date" deve ser uma data válida.',
    'end_date.date': 'O campo "end_date" deve ser uma data válida.',
    'opening_hour.string': 'O campo "opening_hour" deve ser uma string válida.',
    'contact.string': 'O campo "contact" deve ser uma string válida.',
    'location_name.string': 'O campo "location_name" deve ser uma string válida.',
    'general_information.string': 'O campo "general_information" deve ser uma string válida.',
    'house_map.string': 'O campo "house_map" deve ser uma string válida.',
    'max_capacity.number': 'O campo "max_capacity" deve ser um número.',
    'promoter_id.required': 'O campo "promoter_id" é obrigatório.',
    'promoter_id.string': 'O campo "promoter_id" deve ser uma string válida.',
    'promoter_id.exists': 'O "promoter_id" fornecido não existe.',
  };
}

class UpdateEventValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string(),
    name: schema.string.optional(),
    description: schema.string.optional(),
    status_id: schema.string.optional({}, [rules.exists({ table: 'statuses', column: 'id' })]),
    address_id: schema.string.optional({}, [rules.exists({ table: 'addresses', column: 'id' })]),
    category_id: schema.string.optional({}, [rules.exists({ table: 'categories', column: 'id' })]),
    rating_id: schema.string.optional({}, [rules.exists({ table: 'ratings', column: 'id' })]),
    start_date: schema.date.optional(),
    end_date: schema.date.optional(),
    opening_hour: schema.string.optional(),
    contact: schema.string.optional(),
    location_name: schema.string.optional(),
    general_information: schema.string.optional(),
    house_map: schema.string.optional(),
    max_capacity: schema.number.optional(),
    promoter_id: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'id.string': 'O campo "id" deve ser uma string válida.',
    'name.string': 'O campo "name" deve ser uma string válida.',
    'description.string': 'O campo "description" deve ser uma string válida.',
    'status_id.string': 'O campo "status_id" deve ser uma string válida.',
    'status_id.exists': 'O "status_id" fornecido não existe.',
    'address_id.string': 'O campo "address_id" deve ser uma string válida.',
    'address_id.exists': 'O "address_id" fornecido não existe.',
    'category_id.string': 'O campo "category_id" deve ser uma string válida.',
    'category_id.exists': 'O "category_id" fornecido não existe.',
    'rating_id.string': 'O campo "rating_id" deve ser uma string válida.',
    'rating_id.exists': 'O "rating_id" fornecido não existe.',
    'start_date.date': 'O campo "start_date" deve ser uma data válida.',
    'end_date.date': 'O campo "end_date" deve ser uma data válida.',
    'opening_hour.string': 'O campo "opening_hour" deve ser uma string válida.',
    'contact.string': 'O campo "contact" deve ser uma string válida.',
    'location_name.string': 'O campo "location_name" deve ser uma string válida.',
    'general_information.string': 'O campo "general_information" deve ser uma string válida.',
    'house_map.string': 'O campo "house_map" deve ser uma string válida.',
    'max_capacity.number': 'O campo "max_capacity" deve ser um número.',
    'promoter_id.string': 'O campo "promoter_id" deve ser uma string válida.',
    'promoter_id.exists': 'O "promoter_id" fornecido não existe.',
  };
}

export { CreateEventValidator, UpdateEventValidator };
