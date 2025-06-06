import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import {
  BaseModel,
  column,
  beforeCreate,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  beforeSave,
} from '@ioc:Adonis/Lucid/Orm';
import Roles from './Roles';
import Tokens from './Tokens';
import Events from './Events';
import People from './People';
import Notifications from './Notifications';
import PdvUsers from './PdvUsers';
import Hash from '@ioc:Adonis/Core/Hash';
import UserAttachments from './UserAttachments';

export default class Users extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public email: string | null;

  @column()
  public alias: string | null;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public role_id: string | null;

  @column()
  public people_id: string;

  @column()
  public account_verified: boolean;

  @column()
  public google_id: string | null;

  @column()
  public provider: string | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime | null;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime | null;

  @column.dateTime()
  public deleted_at: DateTime | null;

  @belongsTo(() => People, {
    foreignKey: 'people_id',
  })
  public people: BelongsTo<typeof People>;

  @belongsTo(() => Roles, {
    foreignKey: 'role_id',
  })
  public role: BelongsTo<typeof Roles>;

  @hasMany(() => Tokens, {
    foreignKey: 'user_id',
  })
  public tokens: HasMany<typeof Tokens>;

  @hasMany(() => Events, {
    foreignKey: 'promoter_id',
  })
  public events: HasMany<typeof Events>;

  @hasMany(() => PdvUsers, {
    foreignKey: 'user_id',
  })
  public pdvUsers: HasMany<typeof PdvUsers>;

  @hasMany(() => Notifications, {
    foreignKey: 'sender_id',
  })
  public notifications: HasMany<typeof Notifications>;

  @hasMany(() => UserAttachments, {
    foreignKey: 'user_id',
  })
  public attachments: HasMany<typeof UserAttachments>;

  @beforeCreate()
  public static assignUuid(user: Users) {
    user.id = uuidv4();
  }

  @beforeSave()
  public static async hashPassword(user: Users) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
