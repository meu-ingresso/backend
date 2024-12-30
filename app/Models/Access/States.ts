import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Cities from './Cities';

export default class States extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public acronym: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime()
  public deleted_at: DateTime | null;

  @hasMany(() => Cities, {
    foreignKey: 'state_id',
  })
  public cities: HasMany<typeof Cities>;

  @beforeCreate()
  public static assignUuid(state: States) {
    state.id = uuidv4();
  }
}
