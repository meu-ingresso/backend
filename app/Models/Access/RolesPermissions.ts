import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { column, BaseModel, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Permission from './Permissions';
import Role from './Roles';

export default class RolesPermissions extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public role_id: string;

  @column()
  public permission_id: string;

  @belongsTo(() => Permission, {
    foreignKey: 'permission_id',
  })
  public permission: BelongsTo<typeof Permission>;

  @belongsTo(() => Role, {
    foreignKey: 'role_id',
  })
  public role: BelongsTo<typeof Role>;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @beforeCreate()
  public static async assignUuid(rolePermission: RolesPermissions) {
    if (!rolePermission.id) {
      rolePermission.id = uuidv4();
    }
  }
}
