import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';
import Database from '@ioc:Adonis/Lucid/Database';

class CreateEventValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    alias: schema.string({ trim: true }, [
      rules.unique({
        table: 'events',
        column: 'alias',
        where: async (query) => {
          const status = await Database.from('statuses')
            .where('name', 'Reprovado')
            .where('module', 'event')
            .whereNull('deleted_at')
            .first();

          if (!status) {
            throw new Error('Status "Reprovado" não encontrado');
          }

          query.whereNull('deleted_at').whereNot('status_id', status.id);
        },
      }),
    ]),
    name: schema.string({ trim: true }),
    description: schema.string.optional({ trim: true }),
    status_id: schema.string({ trim: true }, [rules.exists({ table: 'statuses', column: 'id' })]),
    address_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'addresses', column: 'id' })]),
    category_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'categories', column: 'id' })]),
    rating_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'ratings', column: 'id' })]),
    start_date: schema.date(),
    end_date: schema.date.optional(),
    location_name: schema.string.optional({ trim: true }),
    general_information: schema.string.optional({ trim: true }),
    absorb_service_fee: schema.boolean.optional(),
    availability: schema.enum(['Publico', 'Privado', 'Página']),
    sale_type: schema.enum(['Ingresso', 'Inscrição']),
    event_type: schema.enum(['Presencial', 'Online', 'Híbrido']),
    is_featured: schema.boolean.optional(),
    promoter_id: schema.string({ trim: true }, [rules.exists({ table: 'users', column: 'id' })]),
  });

  public messages = {
    'alias.required': 'O campo "alias" é obrigatório.',
    'alias.unique': 'Já existe um evento ativo com este alias. Por favor, escolha outro alias.',
    'name.required': 'O campo "name" é obrigatório.',
    'status_id.required': 'O campo "status_id" é obrigatório.',
    'start_date.required': 'O campo "start_date" é obrigatório.',
    'availability.enum': 'O campo "availability" deve ser Publico, Privado ou Página.',
    'sale_type.enum': 'O campo "sale_type" deve ser Ingresso ou Inscrição.',
    'event_type.enum': 'O campo "event_type" deve ser Presencial, Online ou Híbrido.',
    'promoter_id.required': 'O campo "promoter_id" é obrigatório.',
    'absorb_service_fee.boolean': 'O campo "absorb_service_fee" deve ser um booleano.',
    'is_featured.boolean': 'O campo "is_featured" deve ser um booleano.',
  };
}

class UpdateEventValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    id: schema.string({ trim: true }),
    alias: schema.string.optional({ trim: true }, [
      rules.unique({
        table: 'events',
        column: 'alias',
        whereNot: {
          id: this.context.params.id,
        },
        where: async (query) => {
          const status = await Database.from('statuses')
            .where('name', 'Reprovado')
            .where('module', 'event')
            .whereNull('deleted_at')
            .first();

          if (!status) {
            throw new Error('Status "Reprovado" não encontrado');
          }

          query.whereNull('deleted_at').whereNot('status_id', status.id);
        },
      }),
    ]),
    name: schema.string.optional({ trim: true }),
    description: schema.string.optional({ trim: true }),
    status_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'statuses', column: 'id' })]),
    address_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'addresses', column: 'id' })]),
    category_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'categories', column: 'id' })]),
    rating_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'ratings', column: 'id' })]),
    start_date: schema.date.optional(),
    end_date: schema.date.optional(),
    location_name: schema.string.optional({ trim: true }),
    general_information: schema.string.optional({ trim: true }),
    absorb_service_fee: schema.boolean.optional(),
    availability: schema.enum.optional(['Publico', 'Oculto']),
    sale_type: schema.enum.optional(['Ingresso', 'Inscrição']),
    event_type: schema.enum.optional(['Presencial', 'Online', 'Híbrido']),
    is_featured: schema.boolean.optional(),
    promoter_id: schema.string.optional({ trim: true }, [rules.exists({ table: 'users', column: 'id' })]),
  });

  public messages = {
    'id.required': 'O campo "id" é obrigatório.',
    'alias.unique': 'Já existe um evento ativo com este alias. Por favor, escolha outro alias.',
    'availability.enum': 'O campo "availability" deve ser Publico ou Oculto.',
    'sale_type.enum': 'O campo "sale_type" deve ser Ingresso ou Inscrição.',
    'event_type.enum': 'O campo "event_type" deve ser Presencial, Online ou Híbrido.',
    'absorb_service_fee.boolean': 'O campo "absorb_service_fee" deve ser um booleano.',
    'is_featured.boolean': 'O campo "is_featured" deve ser um booleano.',
  };
}

export { CreateEventValidator, UpdateEventValidator };
