import DataAccessService from './DataAccessService';
import Category from 'App/Models/Access/Categories';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class CategoryService {
  private dataAccessService = new DataAccessService<typeof Category>(Category);

  public async create(record: Record<string, any>): Promise<Category> {
    const category = new Category().fill(record);

    await Database.transaction(async (trx) => {
      category.useTransaction(trx);

      await category.save();
    });

    return category;
  }

  public async update(record: Record<string, any>): Promise<Category> {
    const category = await Category.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      category.useTransaction(trx);

      category.merge({ ...record });

      await category.save();
    });

    return category;
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
