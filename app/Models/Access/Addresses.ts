import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import States from './States';
import Cities from './Cities';
import Events from './Events';

export default class Addresses extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public street: string;

  @column()
  public zipcode: string;

  @column()
  public number: string | null;

  @column()
  public complement: string | null;

  @column()
  public neighborhood: string;

  @column()
  public latitude: number | null;

  @column()
  public longitude: number | null;

  @column()
  public state_id: string;

  @column()
  public city_id: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @belongsTo(() => States, {
    foreignKey: 'state_id',
  })
  public state: BelongsTo<typeof States>;

  @belongsTo(() => Cities, {
    foreignKey: 'city_id',
  })
  public city: BelongsTo<typeof Cities>;

  @hasMany(() => Events, {
    foreignKey: 'address_id',
  })
  public events: HasMany<typeof Events>;

  @beforeCreate()
  public static assignUuid(address: Addresses) {
    address.id = uuidv4();
  }
}
