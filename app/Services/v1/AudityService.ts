import Database from '@ioc:Adonis/Lucid/Database';
import Audity from 'App/Models/Access/Audities';

export default class AudityService {
  public async create(record: Record<string, any>): Promise<Audity> {
    let audity: Audity = new Audity().fill(record);
    try {
      await Database.transaction(async (trx) => {
        audity.useTransaction(trx);

        await audity.save();
      });

      return audity;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  public async findByUserId(user_id: number) {
    try {
      return await Database.query().from('audities').where('chat_id', user_id).orderBy('id', 'asc');
    } catch (err) {
      console.error(err);
      return err;
    }
  }
}
