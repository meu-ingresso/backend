import { DateTime } from 'luxon';
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm';
import User from './Users';

export default class People extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public first_name: string;

  @column()
  public last_name: string;

  @column()
  public email: string;

  @column()
  public tax: string | null;

  @column()
  public phone: string | null;

  @column()
  public person_type: string;

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
}
