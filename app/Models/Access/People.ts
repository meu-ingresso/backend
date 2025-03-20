import { DateTime } from 'luxon';
import { BaseModel, column, hasOne, HasOne, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import User from './Users';
import { v4 as uuidv4 } from 'uuid';

export default class People extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public first_name: string;

  @column()
  public last_name: string;

  @column()
  public social_name: string | null;

  @column()
  public fantasy_name: string | null;

  @column()
  public email: string;

  @column()
  public tax: string | null;

  @column()
  public phone: string | null;

  @column()
  public person_type: string;

  @column()
  public address_id: string | null;

  @column()
  public birth_date: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @column.dateTime()
  public deleted_at: DateTime | null;

  @hasOne(() => User, {
    foreignKey: 'people_id',
  })
  public user: HasOne<typeof User>;

  @beforeCreate()
  public static assignUuid(people: People) {
    people.id = uuidv4();
  }
}
