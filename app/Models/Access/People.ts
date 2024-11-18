import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm';

export default class People extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public first_name: string;

  @column()
  public last_name: string;

  @column()
  public tax: string | null;

  @column()
  public person_type: string | null;

  @column.date()
  public birth_date: DateTime;

  @column()
  public phone: string | null;

  @column()
  public email: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @beforeCreate()
  public static assignUuid(person: People) {
    person.id = uuidv4();
  }
}
