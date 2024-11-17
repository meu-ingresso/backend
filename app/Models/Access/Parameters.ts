import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm';

export default class Parameters extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public key: string;

  @column()
  public value: string | null;

  @column()
  public description: string | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @beforeCreate()
  public static assignUuid(parameter: Parameters) {
    parameter.id = uuidv4();
  }
}
