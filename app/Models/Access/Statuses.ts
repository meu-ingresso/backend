import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';
import Payments from './Payments';
import Coupons from './Coupons';
import Tickets from './Tickets';
import Notifications from './Notifications';
import Pdv from './Pdvs';

export default class Statuses extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public module: string;

  @column()
  public description: string | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @column.dateTime()
  public deleted_at: DateTime | null;

  @hasMany(() => Events, {
    foreignKey: 'status_id',
  })
  public events: HasMany<typeof Events>;

  @hasMany(() => Payments, {
    foreignKey: 'status_id',
  })
  public payments: HasMany<typeof Payments>;

  @hasMany(() => Coupons, {
    foreignKey: 'status_id',
  })
  public coupons: HasMany<typeof Coupons>;

  @hasMany(() => Tickets, {
    foreignKey: 'status_id',
  })
  public tickets: HasMany<typeof Tickets>;

  @hasMany(() => Notifications, {
    foreignKey: 'status_id',
  })
  public notifications: HasMany<typeof Notifications>;

  @hasMany(() => Pdv, {
    foreignKey: 'status_id',
  })
  public pdvs: HasMany<typeof Pdv>;

  @beforeCreate()
  public static assignUuid(status: Statuses) {
    status.id = uuidv4();
  }
}
