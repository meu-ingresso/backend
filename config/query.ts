import SearchRequest from './types/SearchRequest';
import { string } from '@poppinss/utils/build/helpers';

export default class Query<T> {
  public model: any;
  public database: any;

  constructor(database: any, model: T) {
    this.model = model;
    this.database = database;
  }

  public async create(record: Record<string, any>): Promise<any> {
    let model = new this.model().fill(record);

    await this.database.transaction(async (trx: any) => {
      model.useTransaction(trx);

      await model.save();
    });

    return model.serialize();
  }

  public async update(record: Record<string, any>): Promise<any> {
    let model = await this.model.findOrFail(record.id);

    await this.database.transaction(async (trx: any) => {
      model.useTransaction(trx);

      // @ts-ignore
      model.merge({ ...record });

      await model.save();
    });

    return model;
  }

  public async delete(id: string): Promise<void> {
    let model = await this.model.findOrFail(id);

    await model.delete();
  }

  public async find(query?: SearchRequest): Promise<{ data: any }> {
    if (query) {
      const builder = this.model.query();

      this.queryFields(builder, query);
      this.queryWhere(builder, query);
      this.queryWhereHas(builder, query);
      this.queryWhereBetween(builder, query);
      this.querySearch(builder, query);
      this.queryPreloads(builder, query);
      this.queryPreloadsWithWhereHas(builder, query);

      let result = await builder.first();

      return { data: result };
    }

    return { data: null };
  }

  public async findOrFail(id: string): Promise<{ data: any }> {
    let result = await this.model.findOrFail(id);
    return { data: result };
  }

  public async findByOrFail(key: string, value: string): Promise<{ data: any }> {
    let result = await this.model.findByOrFail(key, value);
    return { data: result };
  }

  public async search(query?: SearchRequest): Promise<{ meta?: any; data: any[] }> {
    if (query) {
      const builder = this.model.query();

      this.queryFields(builder, query);
      this.queryWhere(builder, query);
      this.queryWhereHas(builder, query);
      this.queryWhereBetween(builder, query);
      this.queryOrderBy(builder, query);
      this.querySearch(builder, query);
      this.queryPreloads(builder, query);
      this.queryPreloadsWithWhereHas(builder, query);
      this.queryWithCounter(builder, query);

      const result = await builder.paginate(query.page || 1, query.limit);

      const serialized = result.serialize();

      const meta = {
        total: serialized.meta.total,
        perPage: serialized.meta.per_page,
        currentPage: serialized.meta.current_page,
        lastPage: serialized.meta.last_page,
        firstPage: serialized.meta.first_page,
      };

      return { meta, data: serialized.data };
    }

    return { data: [] };
  }

  private queryFields(builder: any, query: SearchRequest): void {
    if (query.fields) {
      builder.select(query.fields);
    }
  }

  private queryWhere(builder: any, query: SearchRequest): void {
    if (query.where) {
      const wheres = Object.entries(query.where);

      for (let index = 0; index < wheres.length; index++) {
        const where: Array<any> = wheres[index];

        if (where[1].v) {
          let value = where[1].v;
          let operation = where[1].o;

          if (operation && operation.includes('LIKE')) {
            value = operation.replace('LIKE', value).replace(/_/g, '%');
            operation = 'ILIKE';
          }

          const fields: Array<string> = where[0].split(':');

          if (fields.length == 1) {
            builder.where(where[0], operation || '=', value);
          } else {
            builder.where((q: any) => {
              for (let index = 0; index < fields.length; index++) {
                q.orWhere(fields[index], operation || '=', value);
              }
            });
          }
        }
      }
    }
  }

  private queryWhereBetween(builder: any, query: SearchRequest): void {
    if (query.whereBetween) {
      const whereBetweens = Object.entries(query.whereBetween);

      for (let index = 0; index < whereBetweens.length; index++) {
        const where: Array<any> = whereBetweens[index];

        let value = where[1].v;
        // @ts-ignore
        let operation = where[1].o;

        builder.whereBetween(where[0], value);
      }
    }
  }

  private queryWhereHas(builder: any, query: SearchRequest): void {
    if (query.whereHas) {
      builder.where((subBuilder) => {
        // @ts-ignore
        this.queryWhereHasRecursive(subBuilder, Object.entries(query.whereHas));
      });
    }
  }

  private queryWhereHasRecursive(builder: any, whereHases: any) {
    for (let index = 0; index < whereHases.length; index++) {
      const whereHas: Array<any> = whereHases[index];

      if (whereHas[1].v) {
        let value = whereHas[1].v;
        let operation = whereHas[1].o;

        if (operation && operation.includes('LIKE')) {
          value = operation.replace('LIKE', value).replace(/_/g, '%');
          operation = 'ILIKE';
        }

        const orFields: Array<string> = whereHas[0].split(':');

        if (orFields.length == 1) {
          builder.where(orFields[0], operation || '=', value);
        } else {
          for (let index = 0; index < orFields.length; index++) {
            builder.orWhere(orFields[index], operation || '=', value);
          }
        }
      } else {
        builder.whereHas(whereHas[0], (subQuery: any) =>
          this.queryWhereHasRecursive(subQuery, Object.entries(whereHas[1]))
        );
      }
    }

    return builder;
  }

  private queryOrderBy(builder: any, query: SearchRequest): void {
    if (query.orderBy) {
      let ordersBy: any = [];
      for (let index = 0; index < query.orderBy.length; index++) {
        const orderBy = query.orderBy[index].split(':');

        if (orderBy[0].includes('.')) {
          const columns = orderBy[0].split('.');
          const sortColumn = columns.pop();
          const sortTable = this.queryOrderByRelationRecursive(builder, columns, builder.model);

          if (sortTable) {
            if (index == 0) {
              builder.select(`${builder.model.table}.*`);
            }

            ordersBy.push({ column: `${sortTable}.${sortColumn}`, order: orderBy[1] ? orderBy[1] : 'desc' });
          }
        } else {
          ordersBy.push({ column: orderBy[0], order: orderBy[1] ? orderBy[1] : 'desc' });
        }
      }
      builder.orderBy(ordersBy);
    }
  }

  private queryOrderByRelationRecursive(builder: any, relations: Array<string>, model: any): string {
    const definition = relations.shift();

    if (!definition) {
      return '';
    }

    const relationDefinition = model.$relationsDefinitions.get(definition);
    if (!relationDefinition) {
      console.error(`Relação '${definition}' não encontrada no modelo.`);
      return '';
    }

    const relatedModel = relationDefinition.relatedModel();

    const localTable = model.table;
    const foreignTable = relatedModel.table;

    const localKey = relationDefinition.localKey || 'id';
    const foreignKey = relationDefinition.foreignKey || `${string.snakeCase(definition)}_id`;

    if (!localKey || !foreignKey) {
      console.error('A relação precisa ter chaves localKey e foreignKey explícitas');
      return '';
    }

    if (relationDefinition.type === 'hasOne') {
      builder.leftJoin(foreignTable, `${foreignTable}.${foreignKey}`, `${localTable}.${string.snakeCase(localKey)}`);
    }

    if (relationDefinition.type === 'belongsTo') {
      builder.leftJoin(foreignTable, `${foreignTable}.${localKey}`, `${localTable}.${string.snakeCase(foreignKey)}`);
    }

    if (relations.length > 0) {
      return this.queryOrderByRelationRecursive(builder, relations, relatedModel);
    } else {
      return foreignTable;
    }
  }

  private querySearch(builder: any, query: SearchRequest): void {
    if (query.search) {
      builder.where((subBuilder) => {
        // @ts-ignore
        this.querySearchRecursive(subBuilder, Object.entries(query.search));
      });
    }
  }

  private querySearchRecursive(builder: any, searches: any) {
    for (let index = 0; index < searches.length; index++) {
      const search: Array<any> = searches[index];

      if (search[1].v) {
        let value = search[1].v;
        let operation = search[1].o;

        if (operation && operation.includes('LIKE')) {
          value = operation.replace('LIKE', value).replace(/_/g, '%');
          operation = 'ILIKE';
        }

        const orFields: Array<string> = search[0].split(':');

        for (let index = 0; index < orFields.length; index++) {
          builder.orWhere(orFields[index], operation || '=', value);
        }
      } else {
        builder.orWhereHas(search[0], (subQuery: any) =>
          this.querySearchRecursive(subQuery, Object.entries(search[1]))
        );
      }
    }

    return builder;
  }

  private queryPreloads(builder: any, query: SearchRequest): void {
    if (query.preloads) {
      this.queryPreloadRecursive(builder, query.preloads.join(','));
    }
  }

  private queryPreloadsWithWhereHas(builder: any, query: SearchRequest): void {
    if (query.preloadsWhereHas) {
      this.queryPreloadRecursive(builder, query.preloadsWhereHas.join(','), query.whereHas);
    }
  }

  private queryPreloadRecursive(builder: any, preload: string, whereHas?: { [key: string]: any }) {
    const preloads = preload.split(',');

    const trails: any = {};
    for (let index = 0; index < preloads.length; index++) {
      const items = preloads[index].split(':');

      if (items.length == 1) {
        const lastItem = items.shift();

        if (whereHas && lastItem && whereHas[lastItem]) {
          // @ts-ignore
          builder.preload(lastItem, (subQuery) => {
            // @ts-ignore
            this.queryWhere(subQuery, { where: whereHas[lastItem] });
          });
        } else {
          // @ts-ignore
          builder.preload(lastItem);
        }
      } else {
        const firstItem = items.shift();
        if (firstItem) {
          trails[firstItem] = `${trails[firstItem] ? `${trails[firstItem]},` : ''}${items.join(':')}`;
        }
      }
    }

    const nextPreloads = Object.keys(trails);
    for (let index = 0; index < nextPreloads.length; index++) {
      // @ts-ignore
      builder.preload(nextPreloads[index], (subQuery) => {
        let subWhereHas;

        if (whereHas && whereHas[nextPreloads[index]]) {
          subWhereHas = whereHas[nextPreloads[index]];

          // @ts-ignore
          this.queryWhereHas(subQuery, { whereHas: subWhereHas });
        }

        // @ts-ignore
        this.queryPreloadRecursive(subQuery, trails[nextPreloads[index]], subWhereHas);
      });
    }

    return builder;
  }

  private queryWithCounter(builder: any, query: SearchRequest): void {
    if (query.withCounts) {
      const withCounts = query.withCounts;

      for (let index = 0; index < withCounts.length; index++) {
        // @ts-ignore
        builder.withCount(withCounts[index]);
      }
    }
  }
}
