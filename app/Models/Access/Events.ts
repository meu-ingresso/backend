import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import {
  BaseModel,
  column,
  beforeCreate,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
  hasOne,
  HasOne,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm';
import Tickets from './Tickets';
import EventCheckoutFields from './EventCheckoutFields';
import Categories from './Categories';
import Ratings from './Ratings';
import Statuses from './Statuses';
import Addresses from './Addresses';
import EventAttachments from './EventAttachments';
import EventViews from './EventViews';
import EventFees from './EventFees';
import EventCollaborators from './EventCollaborators';
import Promoters from './Users';
import Coupons from './Coupons';
import Pdv from './Pdvs';
import GuestLists from './GuestLists';
import EventGroups from './EventGroups';

export default class Events extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public alias: string;

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
  public location_name: string | null;

  @column()
  public general_information: string | null;

  @column()
  public availability: 'Publico' | 'Privado' | 'Página';

  @column()
  public sale_type: 'Ingresso' | 'Inscrição';

  @column()
  public event_type: 'Presencial' | 'Online' | 'Híbrido';

  @column()
  public group_id: string | null;

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
  public absorb_service_fee: boolean;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @column.dateTime()
  public deleted_at: DateTime | null;

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

  @hasMany(() => EventViews, { foreignKey: 'event_id' })
  public views: HasMany<typeof EventViews>;

  @hasOne(() => EventFees, { foreignKey: 'event_id' })
  public fees: HasOne<typeof EventFees>;

  @manyToMany(() => EventGroups, {
    pivotTable: 'event_group_relations',
    pivotForeignKey: 'event_id',
    pivotRelatedForeignKey: 'group_id',
  })
  public groups: ManyToMany<typeof EventGroups>;

  @hasMany(() => EventCollaborators, { foreignKey: 'event_id' })
  public collaborators: HasMany<typeof EventCollaborators>;

  @hasMany(() => Coupons, { foreignKey: 'event_id' })
  public coupons: HasMany<typeof Coupons>;

  @hasMany(() => EventCheckoutFields, { foreignKey: 'event_id' })
  public checkoutFields: HasMany<typeof EventCheckoutFields>;

  @hasMany(() => Pdv, { foreignKey: 'event_id' })
  public pdvs: HasMany<typeof Pdv>;

  @hasMany(() => GuestLists, {
    foreignKey: 'event_id',
  })
  public guestLists: HasMany<typeof GuestLists>;

  @beforeCreate()
  public static assignUuid(event: Events) {
    event.id = uuidv4();
  }
}
