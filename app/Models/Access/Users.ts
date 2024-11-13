import { v4 as uuidv4 } from 'uuid';
import Hash from '@ioc:Adonis/Core/Hash';
import { DateTime } from 'luxon';
import {
  BaseModel,
  beforeCreate,
  beforeSave,
  column,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm';
import Tokens from 'App/Models/Access/Tokens';
import Audity from 'App/Models/Access/Audities';
import Roles from './Roles';

export default class Users extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public first_name: string;

  @column()
  public last_name: string;

  @column()
  public cellphone: string;

  @column()
  public email: string;

  @column()
  public id_erp: string;

  @column()
  public hiring_mode: string;

  @column()
  public role_id: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public is_active: boolean;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @belongsTo(() => Roles, {
    foreignKey: 'role_id',
  })
  public role: BelongsTo<typeof Roles>;

  @hasMany(() => Tokens, {
    foreignKey: 'user_id',
  })
  public tokens: HasMany<typeof Tokens>;

  @hasMany(() => Audity, {
    foreignKey: 'user_id',
  })
  public audities: HasMany<typeof Audity>;

  @beforeSave()
  public static async hashPassword(user: Users) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @beforeCreate()
  public static async assignUuid(user: Users) {
    if (!user.id) {
      user.id = uuidv4();
    }
  }
}
