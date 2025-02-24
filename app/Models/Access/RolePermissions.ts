import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import Roles from './Roles';
import Permissions from './Permissions';

export default class RolePermissions extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public role_id: string;

  @column()
  public permission_id: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @belongsTo(() => Roles, {
    foreignKey: 'role_id',
  })
  public role: BelongsTo<typeof Roles>;

  @belongsTo(() => Permissions, {
    foreignKey: 'permission_id',
  })
  public permission: BelongsTo<typeof Permissions>;

  @beforeCreate()
  public static assignUuid(rolePermission: RolePermissions) {
    rolePermission.id = uuidv4();
  }
}
