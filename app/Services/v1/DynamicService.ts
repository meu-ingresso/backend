import Database from '@ioc:Adonis/Lucid/Database';
import { BaseModel } from '@ioc:Adonis/Lucid/Orm';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';
import DataAccessService from './DataAccessService';
import State from 'App/Models/Access/States';
import City from 'App/Models/Access/Cities';
import Address from 'App/Models/Access/Addresses';
import Category from 'App/Models/Access/Categories';
import Coupon from 'App/Models/Access/Coupons';
import CustomerTicket from 'App/Models/Access/CustomerTickets';
import EventCollaborator from 'App/Models/Access/EventCollaborators';
import Event from 'App/Models/Access/Events';
import EventFee from 'App/Models/Access/EventFees';
import Parameter from 'App/Models/Access/Parameters';
import Payment from 'App/Models/Access/Payments';
import People from 'App/Models/Access/People';
import Permission from 'App/Models/Access/Permissions';
import Rating from 'App/Models/Access/Ratings';
import RolePermission from 'App/Models/Access/RolePermissions';
import Role from 'App/Models/Access/Roles';
import Status from 'App/Models/Access/Statuses';
import Ticket from 'App/Models/Access/Tickets';
import TicketEventCategory from 'App/Models/Access/TicketEventCategories';
import User from 'App/Models/Access/Users';
import AuditLog from 'App/Models/Access/AuditLogs';
import EventCheckoutField from 'App/Models/Access/EventCheckoutFields';
import TicketField from 'App/Models/Access/TicketFields';
import EventCheckoutFieldTicket from 'App/Models/Access/EventCheckoutFieldsTickets';
import CouponsTickets from 'App/Models/Access/CouponsTickets';

import { DateTime } from 'luxon';

export default class DynamicService {
  private modelMap: Record<string, typeof BaseModel> = {
    State,
    City,
    Address,
    Category,
    Coupon,
    CustomerTicket,
    EventCollaborator,
    Event,
    EventFee,
    Parameter,
    Payment,
    People,
    Permission,
    Rating,
    RolePermission,
    Role,
    Status,
    Ticket,
    TicketEventCategory,
    User,
    AuditLog,
    EventCheckoutField,
    TicketField,
    EventCheckoutFieldTicket,
    CouponsTickets,
  };

  public async create(dynamicModel: string, record: Record<string, any>): Promise<any> {
    const ModelClass = this.modelMap[dynamicModel];

    if (!ModelClass) {
      throw new Error(`Model ${dynamicModel} not found`);
    }

    const model = new ModelClass().fill(record);

    await Database.transaction(async (trx) => {
      model.useTransaction(trx);
      await model.save();
    });

    return model;
  }

  public async update(dynamicModel: string, record: Record<string, any>): Promise<any> {
    const ModelClass = this.modelMap[dynamicModel];

    if (!ModelClass) {
      throw new Error(`Model ${dynamicModel} not found`);
    }

    const model = await ModelClass.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      model.useTransaction(trx);

      model.merge({ ...record });

      await model.save();
    });

    return model;
  }

  public async getById(dynamicModel: string, id: string): Promise<ModelObject> {
    const ModelClass = this.modelMap[dynamicModel];

    if (!ModelClass) {
      throw new Error(`Model ${dynamicModel} not found`);
    }

    return await ModelClass.findOrFail(id);
  }

  public async search(dynamicModel: string, query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    const ModelClass = this.modelMap[dynamicModel];

    if (!ModelClass) {
      throw new Error(`Model ${dynamicModel} not found`);
    }

    const dataAccessService = new DataAccessService<typeof ModelClass>(ModelClass);

    return dataAccessService.search(query);
  }

  public async softDelete(dynamicModel: string, record: Record<string, any>): Promise<any> {
    const ModelClass = this.modelMap[dynamicModel];

    if (!ModelClass) {
      throw new Error(`Model ${dynamicModel} not found`);
    }

    const model = await ModelClass.findOrFail(record.id);

    record.deleted_at = DateTime.now();

    await Database.transaction(async (trx) => {
      model.useTransaction(trx);

      model.merge({ ...record });

      await model.save();
    });

    return model;
  }
}
