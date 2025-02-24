import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Pdv from './Pdvs';
import Ticket from './Tickets';

export default class PdvTickets extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public pdv_id: string;

  @column()
  public ticket_id: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @belongsTo(() => Pdv, {
    foreignKey: 'pdv_id',
  })
  public pdv: BelongsTo<typeof Pdv>;

  @belongsTo(() => Ticket, {
    foreignKey: 'ticket_id',
  })
  public ticket: BelongsTo<typeof Ticket>;

  @beforeCreate()
  public static assignUuid(pdvTickets: PdvTickets) {
    pdvTickets.id = uuidv4();
  }
}
