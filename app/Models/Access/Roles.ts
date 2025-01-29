import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Users from './Users';
import RolePermissions from './RolePermissions';

export default class Roles extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public description: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @column.dateTime()
  public deleted_at: DateTime | null;

  @hasMany(() => Users, {
    foreignKey: 'role_id',
  })
  public users: HasMany<typeof Users>;

  @hasMany(() => RolePermissions, {
    foreignKey: 'role_id',
  })
  public rolePermissions: HasMany<typeof RolePermissions>;

  @beforeCreate()
  public static assignUuid(role: Roles) {
    role.id = uuidv4();
  }
}
