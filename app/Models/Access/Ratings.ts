import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';

export default class Ratings extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public description: string | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @hasMany(() => Events, {
    foreignKey: 'rating_id',
  })
  public events: HasMany<typeof Events>;

  @beforeCreate()
  public static assignUuid(rating: Ratings) {
    rating.id = uuidv4();
  }
}
