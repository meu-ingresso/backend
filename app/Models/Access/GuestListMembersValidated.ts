import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Users from './Users';
import GuestListMembers from './GuestListMembers';

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
