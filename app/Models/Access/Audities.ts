import { DateTime } from 'luxon';
import { BaseModel, column, hasOne, HasOne, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import User from './Users';
import { v4 as uuidv4 } from 'uuid';

export default class Audity extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public user_id: string;

  @column()
  public module: string;

  @column()
  public action: string;

  @column()
  public content: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @hasOne(() => User, {
    localKey: 'user_id',
    foreignKey: 'id',
  })
  public user: HasOne<typeof User>;

  @beforeCreate()
  public static async assignUuid(audity: Audity) {
    if (!audity.id) {
      audity.id = uuidv4();
    }
  }
}
