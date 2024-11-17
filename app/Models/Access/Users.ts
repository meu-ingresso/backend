import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Roles from './Roles';
import ApiTokens from './ApiTokens';
import Events from './Events';

export default class Users extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public email: string | null;

  @column({ serializeAs: null })
  public password: string | null;

  @column()
  public is_active: boolean;

  @column()
  public role_id: string | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime | null;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime | null;

  @column.dateTime()
  public deleted_at: DateTime | null;

  @belongsTo(() => Roles, {
    foreignKey: 'role_id',
  })
  public role: BelongsTo<typeof Roles>;

  @hasMany(() => ApiTokens, {
    foreignKey: 'user_id',
  })
  public apiTokens: HasMany<typeof ApiTokens>;

  @hasMany(() => Events, {
    foreignKey: 'promoter_id',
  })
  public events: HasMany<typeof Events>;

  @beforeCreate()
  public static assignUuid(user: Users) {
    user.id = uuidv4();
  }
}
