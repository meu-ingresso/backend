import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';
import Payments from './Payments';

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

  @beforeCreate()
  public static assignUuid(status: Statuses) {
    status.id = uuidv4();
  }
}
