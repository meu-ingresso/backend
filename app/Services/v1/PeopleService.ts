import DataAccessService from './DataAccessService';
import Person from 'App/Models/Access/People';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class PersonService {
  private dataAccessService = new DataAccessService<typeof Person>(Person);

  public async create(record: Record<string, any>): Promise<Person> {
    const person = new Person().fill(record);

    await Database.transaction(async (trx) => {
      person.useTransaction(trx);

      await person.save();
    });

    return person;
  }

  public async update(record: Record<string, any>): Promise<Person> {
    const person = await Person.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      person.useTransaction(trx);

      person.merge({ ...record });

      await person.save();
    });

    return person;
  }

  public async delete(id: string): Promise<void> {
    const person = await Person.findOrFail(id);

    await Database.transaction(async (trx) => {
      person.useTransaction(trx);

      await person.delete();
    });
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
