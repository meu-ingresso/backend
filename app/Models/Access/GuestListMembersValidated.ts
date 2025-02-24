import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Users from './Users';
import GuestListMembers from './GuestListMembers';
import { DateTime } from 'luxon';

export default class GuestListMembersValidated extends BaseModel {
  public static table = 'guest_list_members_validated';

  @column({ isPrimary: true })
  public id: string;

  @column()
  public guest_list_member_id: string;

  @column()
  public quantity: number;

  @column()
  public validated_by: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @belongsTo(() => Users, {
    foreignKey: 'validated_by',
  })
  public validatedBy: BelongsTo<typeof Users>;

  @belongsTo(() => GuestListMembers, {
    foreignKey: 'guest_list_member_id',
  })
  public guestListMember: BelongsTo<typeof GuestListMembers>;

  @beforeCreate()
  public static assignUuid(guestListMemberValidated: GuestListMembersValidated) {
    guestListMemberValidated.id = uuidv4();
  }
}
