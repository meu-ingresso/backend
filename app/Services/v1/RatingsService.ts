import DataAccessService from './DataAccessService';
import Rating from 'App/Models/Access/Ratings';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class RatingService {
  private dataAccessService = new DataAccessService<typeof Rating>(Rating);

  public async create(record: Record<string, any>): Promise<Rating> {
    const rating = new Rating().fill(record);

    await Database.transaction(async (trx) => {
      rating.useTransaction(trx);

      await rating.save();
    });

    return rating;
  }

  public async update(record: Record<string, any>): Promise<Rating> {
    const rating = await Rating.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      rating.useTransaction(trx);

      rating.merge({ ...record });

      await rating.save();
    });

    return rating;
  }

  public async delete(id: string): Promise<void> {
    const rating = await Rating.findOrFail(id);

    await Database.transaction(async (trx) => {
      rating.useTransaction(trx);

      await rating.delete();
    });
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
