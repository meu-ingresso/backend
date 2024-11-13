import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ReportHandler from './Reporters/ReportHandler';

export default class QueryModelValidator {
  constructor(protected context: HttpContextContract) {}

  public reporter = ReportHandler;

  public schema = schema.create({
    search: schema.object.optional().anyMembers(),
    where: schema.object.optional().anyMembers(),
    whereHas: schema.object.optional().anyMembers(),
    subWhere: schema.object.optional().anyMembers(),
    orderBy: schema.array.optional().members(schema.string()),
    fields: schema.array.optional().members(schema.string()),
    preloads: schema.array.optional().members(schema.string()),
    preloadsWhereHas: schema.array.optional().members(schema.string()),
    withCounts: schema.array.optional().members(schema.string()),
    page: schema.number.optional(),
    limit: schema.number.optional(),
  });

  public messages = {};
}
