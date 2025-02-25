import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import { v4 as uuidv4 } from 'uuid';
import Events from './Events';
import Users from './Users';
import Roles from './Roles';

export default class EventCollaborators extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public user_id: string;

  @column()
  public role_id: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @belongsTo(() => Events, { foreignKey: 'event_id' })
  public event: BelongsTo<typeof Events>;

  @belongsTo(() => Users, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof Users>;

  @belongsTo(() => Roles, { foreignKey: 'role_id' })
  public role: BelongsTo<typeof Roles>;

  @beforeCreate()
  public static assignUuid(eventCollaborator: EventCollaborators) {
    eventCollaborator.id = uuidv4();
  }
}
