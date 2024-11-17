import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Users from './Users';

export default class AuditLogs extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public action: string;

  @column()
  public entity: string;

  @column()
  public entity_id: string | null;

  @column()
  public user_id: string | null;

  @column()
  public old_data: object | null;

  @column()
  public new_data: object | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @belongsTo(() => Users, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof Users>;

  @beforeCreate()
  public static assignUuid(auditLog: AuditLogs) {
    auditLog.id = uuidv4();
  }
}
