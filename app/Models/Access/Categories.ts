import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';

export default class Categories extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public description: string | null;

  @column()
  public is_active: boolean;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @hasMany(() => Events, {
    foreignKey: 'category_id',
  })
  public events: HasMany<typeof Events>;

  @beforeCreate()
  public static assignUuid(category: Categories) {
    category.id = uuidv4();
  }
}
