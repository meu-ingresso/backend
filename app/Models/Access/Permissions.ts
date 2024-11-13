import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { column, BaseModel, beforeCreate, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import RolesPermissions from './RolesPermissions';

export default class Permissions extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public module_prefix: string;

  @column()
  public module_name: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @hasMany(() => RolesPermissions, {
    foreignKey: 'permission_id',
  })
  public roles_permissions: HasMany<typeof RolesPermissions>;

  @beforeCreate()
  public static async assignUuid(permission: Permissions) {
    if (!permission.id) {
      permission.id = uuidv4();
    }
  }
}
