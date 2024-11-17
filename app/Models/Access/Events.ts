import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Statuses from './Statuses';
import Addresses from './Addresses';
import Categories from './Categories';
import Ratings from './Ratings';
import Users from './Users';
import Tickets from './Tickets';
import EventCollaborators from './EventCollaborators';
import EventAttachments from './EventAttachments';

export default class Events extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public description: string | null;

  @column()
  public status_id: string;

  @column()
  public address_id: string | null;

  @column()
  public category_id: string | null;

  @column()
  public rating_id: string | null;

  @column.dateTime()
  public start_date: DateTime;

  @column.dateTime()
  public end_date: DateTime | null;

  @column()
  public opening_hour: string | null;

  @column()
  public contact: string | null;

  @column()
  public location_name: string | null;

  @column()
  public general_information: string | null;

  @column()
  public house_map: string | null;

  @column()
  public max_capacity: number | null;

  @column()
  public promoter_id: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @belongsTo(() => Statuses, {
    foreignKey: 'status_id',
  })
  public status: BelongsTo<typeof Statuses>;

  @belongsTo(() => Addresses, {
    foreignKey: 'address_id',
  })
  public address: BelongsTo<typeof Addresses>;

  @belongsTo(() => Categories, {
    foreignKey: 'category_id',
  })
  public category: BelongsTo<typeof Categories>;

  @belongsTo(() => Ratings, {
    foreignKey: 'rating_id',
  })
  public rating: BelongsTo<typeof Ratings>;

  @belongsTo(() => Users, {
    foreignKey: 'promoter_id',
  })
  public promoter: BelongsTo<typeof Users>;

  @hasMany(() => Tickets, {
    foreignKey: 'event_id',
  })
  public tickets: HasMany<typeof Tickets>;

  @hasMany(() => EventCollaborators, {
    foreignKey: 'event_id',
  })
  public collaborators: HasMany<typeof EventCollaborators>;

  @hasMany(() => EventAttachments, {
    foreignKey: 'event_id',
  })
  public attachments: HasMany<typeof EventAttachments>;

  @beforeCreate()
  public static assignUuid(event: Events) {
    event.id = uuidv4();
  }
}
