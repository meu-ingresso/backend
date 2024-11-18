import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, afterCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Tickets from './Tickets';
import People from './People';
import Users from './Users';

export default class CustomerTickets extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public ticket_id: string;

  @column()
  public current_owner_id: string;

  @column()
  public previous_owner_id: string | null;

  @column()
  public status: string;

  @column()
  public ticket_identifier: string | null;

  @column()
  public validated: boolean;

  @column()
  public validated_by: string | null;

  @column.dateTime()
  public validated_at: DateTime | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @belongsTo(() => Tickets, {
    foreignKey: 'ticket_id',
  })
  public ticket: BelongsTo<typeof Tickets>;

  @belongsTo(() => People, {
    foreignKey: 'current_owner_id',
  })
  public currentOwner: BelongsTo<typeof People>;

  @belongsTo(() => People, {
    foreignKey: 'previous_owner_id',
  })
  public previousOwner: BelongsTo<typeof People>;

  @belongsTo(() => Users, {
    foreignKey: 'validated_by',
  })
  public validatedBy: BelongsTo<typeof Users>;

  @beforeCreate()
  public static assignUuid(customerTicket: CustomerTickets) {
    customerTicket.id = uuidv4();
  }

  @afterCreate()
  public static async generateTicketIdentifier(customerTicket: CustomerTickets) {
    const identifier = CustomerTickets.generateUniqueIdentifier();
    customerTicket.ticket_identifier = identifier;

    await customerTicket.save();
  }

  private static generateUniqueIdentifier(length = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }
}
