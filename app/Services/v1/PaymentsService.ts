import DataAccessService from './DataAccessService';
import Payment from 'App/Models/Access/Payments';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class PaymentService {
  private dataAccessService = new DataAccessService<typeof Payment>(Payment);

  public async create(record: Record<string, any>): Promise<Payment> {
    const payment = new Payment().fill(record);

    await Database.transaction(async (trx) => {
      payment.useTransaction(trx);

      await payment.save();
    });

    return payment;
  }

  public async update(record: Record<string, any>): Promise<Payment> {
    const payment = await Payment.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      payment.useTransaction(trx);

      payment.merge({ ...record });

      await payment.save();
    });

    return payment;
  }

  public async delete(id: string): Promise<void> {
    const payment = await Payment.findOrFail(id);

    await Database.transaction(async (trx) => {
      payment.useTransaction(trx);

      await payment.delete();
    });
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
