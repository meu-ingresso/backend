import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
// import Cities from './Cities';
import Events from './Events';
import People from './People';

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
  public city: string;

  @column()
  public state: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime()
  public deleted_at: DateTime | null;

  // @belongsTo(() => Cities, {
  //   foreignKey: 'city_id',
  // })
  // public city: BelongsTo<typeof Cities>;

  @hasMany(() => Events, {
    foreignKey: 'address_id',
  })
  public events: HasMany<typeof Events>;

  @hasMany(() => People, {
    foreignKey: 'address_id',
  })
  public people: HasMany<typeof People>;

  @beforeCreate()
  public static assignUuid(address: Addresses) {
    address.id = uuidv4();
  }
}
