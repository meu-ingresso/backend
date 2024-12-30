import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import RolePermissions from './RolePermissions';

export default class Permissions extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public description: string | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @column.dateTime()
  public deleted_at: DateTime | null;

  @hasMany(() => RolePermissions, {
    foreignKey: 'permission_id',
  })
  public rolePermissions: HasMany<typeof RolePermissions>;

  @beforeCreate()
  public static assignUuid(permission: Permissions) {
    permission.id = uuidv4();
  }
}
