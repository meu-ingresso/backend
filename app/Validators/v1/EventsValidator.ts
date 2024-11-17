import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class CreateEventValidator {
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

  public messages = {};
}

export class UpdateEventValidator {
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

  public messages = {};
}
