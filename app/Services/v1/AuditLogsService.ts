import DataAccessService from './DataAccessService';
import AuditLog from 'App/Models/Access/AuditLogs';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class AuditLogService {
  private dataAccessService = new DataAccessService<typeof AuditLog>(AuditLog);

  public async create(record: Record<string, any>): Promise<AuditLog> {
    const auditLog = new AuditLog().fill(record);

    await Database.transaction(async (trx) => {
      auditLog.useTransaction(trx);

      await auditLog.save();
    });

    return auditLog;
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}