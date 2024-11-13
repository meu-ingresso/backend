import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { column, BaseModel, beforeCreate, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Users from './Users';
import RolesPermissions from './RolesPermissions';

export default class Roles extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public short_description: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @hasMany(() => Users, {
    foreignKey: 'role_id',
  })
  public users: HasMany<typeof Users>;

  @hasMany(() => RolesPermissions, {
    foreignKey: 'role_id',
  })
  public roles_permissions: HasMany<typeof RolesPermissions>;

  @beforeCreate()
  public static async assignUuid(role: Roles) {
    if (!role.id) {
      role.id = uuidv4();
    }
  }
}
