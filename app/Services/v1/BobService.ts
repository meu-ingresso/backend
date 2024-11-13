import DataAccessService from './DataAccessService';
import Database from '@ioc:Adonis/Lucid/Database';
import Bob from 'App/Models/Access/Bobs';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class BobService {
  private dataAccessService = new DataAccessService<typeof Bob>(Bob);

  public async create(record: Record<string, any>): Promise<Bob> {
    let bob: Bob = new Bob().fill(record);

    await Database.transaction(async (trx) => {
      bob.useTransaction(trx);

      await bob.save();
    });

    return bob;
  }

  public async update(record: Record<string, any>): Promise<Bob> {
    let bob: Bob = await Bob.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      bob.useTransaction(trx);

      bob.merge({ ...record });

      await bob.save();
    });
    return bob;
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }

  public async filterCustomers(): Promise<string[]> {
    const customers = await Database.from('bobs')
      .distinct('customer')
      .select('customer')
      .where('is_active', true)
      .orderBy('customer', 'asc');

    return customers.map((customer: any) => customer.customer.trim()).filter((customer: string) => customer !== '');
  }

  public async filterSellers(): Promise<{ id: string; name: string }[]> {
    const sellers = await Bob.query().whereNotNull('seller_id').distinct('seller_id').preload('seller');

    return sellers.map((seller) => {
      return {
        id: seller.seller_id,
        name: `${seller.seller.first_name} ${seller.seller.last_name}`,
      };
    });
  }

  public async filterPricers(): Promise<{ id: string; name: string }[]> {
    const pricers = await Bob.query().whereNotNull('user_id').distinct('user_id').preload('user');

    return pricers.map((user) => {
      return {
        id: user.user_id,
        name: `${user.user.first_name} ${user.user.last_name}`,
      };
    });
  }

  public async filterOrigins(): Promise<string[]> {
    const origins = await Database.from('bobs')
      .distinct('origin')
      .select('origin')
      .where('is_active', true)
      .orderBy('origin', 'asc');

    return origins.map((origin: any) => origin.origin.trim()).filter((origin: string) => origin !== '');
  }

  public async filterDestinies(): Promise<string[]> {
    const destinies = await Database.from('bobs')
      .distinct('destiny')
      .select('destiny')
      .where('is_active', true)
      .orderBy('destiny', 'asc');

    return destinies.map((destiny: any) => destiny.destiny.trim()).filter((destiny: string) => destiny !== '');
  }

  public async filterProducts(): Promise<string[]> {
    const products = await Database.from('bobs')
      .distinct('product')
      .select('product')
      .where('is_active', true)
      .orderBy('product', 'asc');

    return products.map((product: any) => product.product.trim()).filter((product: string) => product !== '');
  }

  public async filterYears(): Promise<string[]> {
    const years = await Database.from('bobs')
      .distinct('year_effective')
      .select('year_effective')
      .orderBy('year_effective', 'asc');

    return years
      .map((year: any) => parseInt(year.year_effective.trim()))
      .filter((year: number) => !isNaN(year))
      .sort((a, b) => a - b)
      .map((year: number) => year.toString());
  }

  public async filterMonths(year: string): Promise<string[]> {
    const months = await Database.from('bobs')
      .where('year_effective', year)
      .distinct('month_effective')
      .select('month_effective')
      .where('is_active', true);

    return months
      .map((month: any) => parseInt(month.month_effective.trim()))
      .filter((month: number) => !isNaN(month))
      .sort((a, b) => a - b)
      .map((month: number) => month.toString());
  }
}
