import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Pdv from './Pdvs';
import User from './Users';

export default class PdvUsers extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public pdv_id: string;

  @column()
  public user_id: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @belongsTo(() => Pdv, {
    foreignKey: 'pdv_id',
  })
  public pdv: BelongsTo<typeof Pdv>;

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>;

  @beforeCreate()
  public static assignUuid(pdvUsers: PdvUsers) {
    pdvUsers.id = uuidv4();
  }
}
