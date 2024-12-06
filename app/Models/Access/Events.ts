import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Tickets from './Tickets';
import EventCheckoutFields from './EventCheckoutFields';
import EventGuests from './EventGuests';
import Categories from './Categories';
import Ratings from './Ratings';
import Statuses from './Statuses';
import Addresses from './Addresses';
import EventAttachments from './EventAttachments';
import EventCollaborators from './EventCollaborators';
import Promoters from './Users';

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

  @column()
  public start_date: DateTime;

  @column()
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
  public max_capacity: number | null;

  @column()
  public availability: 'Publico' | 'Oculto';

  @column()
  public type: 'Ingresso' | 'Inscrição';

  @column()
  public promoter_id: string;

  @column()
  public id_pixel: string | null;

  @column()
  public id_tag_manager: string | null;

  @column()
  public id_analytics: string | null;

  @column()
  public id_google_ads: string | null;

  @column()
  public ads_conversion_label: string | null;

  @column()
  public is_featured: boolean;

  @column()
  public is_active: boolean;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @belongsTo(() => Statuses, { foreignKey: 'status_id' })
  public status: BelongsTo<typeof Statuses>;

  @belongsTo(() => Categories, { foreignKey: 'category_id' })
  public category: BelongsTo<typeof Categories>;

  @belongsTo(() => Ratings, { foreignKey: 'rating_id' })
  public rating: BelongsTo<typeof Ratings>;

  @belongsTo(() => Addresses, { foreignKey: 'address_id' })
  public address: BelongsTo<typeof Addresses>;

  @belongsTo(() => Promoters, { foreignKey: 'promoter_id' })
  public promoter: BelongsTo<typeof Promoters>;

  @hasMany(() => Tickets, { foreignKey: 'event_id' })
  public tickets: HasMany<typeof Tickets>;

  @hasMany(() => EventAttachments, { foreignKey: 'event_id' })
  public attachments: HasMany<typeof EventAttachments>;

  @hasMany(() => EventCollaborators, { foreignKey: 'event_id' })
  public collaborators: HasMany<typeof EventCollaborators>;

  @hasMany(() => EventCheckoutFields, { foreignKey: 'event_id' })
  public checkoutFields: HasMany<typeof EventCheckoutFields>;

  @hasMany(() => EventGuests, { foreignKey: 'event_id' })
  public guests: HasMany<typeof EventGuests>;

  @beforeCreate()
  public static assignUuid(event: Events) {
    event.id = uuidv4();
  }
}
