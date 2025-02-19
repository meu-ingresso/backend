import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';
import Users from './Users';
import GuestListMembers from './GuestListMembers';

export default class GuestLists extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public name: string;

  @column()
  public created_by: string;

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

  @belongsTo(() => Users, {
    foreignKey: 'created_by',
  })
  public creator: BelongsTo<typeof Users>;

  @hasMany(() => GuestListMembers, {
    foreignKey: 'guest_list_id',
  })
  public members: HasMany<typeof GuestListMembers>;

  @beforeCreate()
  public static assignUuid(guestList: GuestLists) {
    guestList.id = uuidv4();
  }
}
