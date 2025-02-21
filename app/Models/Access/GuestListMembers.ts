import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import GuestLists from './GuestLists';
import Users from './Users';

export default class GuestListMembers extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public guest_list_id: string;

  @column()
  public first_name: string;

  @column()
  public last_name: string | null;

  @column()
  public quantity: number;

  @column()
  public added_by: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @column.dateTime()
  public deleted_at: DateTime | null;

  @belongsTo(() => GuestLists, {
    foreignKey: 'guest_list_id',
  })
  public guestList: BelongsTo<typeof GuestLists>;

  @belongsTo(() => Users, {
    foreignKey: 'added_by',
  })
  public addedBy: BelongsTo<typeof Users>;

  @beforeCreate()
  public static assignUuid(guestListMember: GuestListMembers) {
    guestListMember.id = uuidv4();
  }
}
