import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import States from './States';
import Addresses from './Addresses';

export default class Cities extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public state_id: string;

  @column()
  public name: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @belongsTo(() => States, {
    foreignKey: 'state_id',
  })
  public state: BelongsTo<typeof States>;

  @hasMany(() => Addresses, {
    foreignKey: 'city_id',
  })
  public addresses: HasMany<typeof Addresses>;

  @beforeCreate()
  public static assignUuid(city: Cities) {
    city.id = uuidv4();
  }
}
