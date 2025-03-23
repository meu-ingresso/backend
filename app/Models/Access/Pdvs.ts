import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';
import Status from './Statuses';
import Payments from './Payments';

export default class Pdv extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public name: string;

  @column()
  public status_id: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @column.dateTime()
  public deleted_at: DateTime | null;

  @belongsTo(() => Events, {
    foreignKey: 'event_id',
  })
  public event: BelongsTo<typeof Events>;

  @belongsTo(() => Status, {
    foreignKey: 'status_id',
  })
  public status: BelongsTo<typeof Status>;

  @hasMany(() => Payments, {
    foreignKey: 'pdv_id',
  })
  public payments: HasMany<typeof Payments>;

  @beforeCreate()
  public static assignUuid(pdv: Pdv) {
    pdv.id = uuidv4();
  }
}
