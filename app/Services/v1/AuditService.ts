import Database from '@ioc:Adonis/Lucid/Database';
import AuditLog from 'App/Models/Access/AuditLogs';

export default class AuditService {
  public async create(
    action: string,
    entity: string,
    entity_id: string | null = null,
    user_id: string | null = null,
    old_data: Record<string, any> | null = null,
    new_data: Record<string, any> | null = null
  ): Promise<void> {
    try {
      const payload = {
        action,
        entity,
        entity_id,
        user_id,
        old_data: old_data ? old_data : null,
        new_data: new_data ? new_data : null,
      };

      const auditLog = new AuditLog().fill(payload);

      await Database.transaction(async (trx) => {
        auditLog.useTransaction(trx);

        await auditLog.save();
      });
    } catch (error) {
      console.error('Error creating audit log:', error);
    }
  }

  public async bulkCreate(
    records: Array<{
      action: string;
      model_name: string;
      record_id: string | null;
      user_id: string | null;
      old_data: Record<string, any> | null;
      new_data: Record<string, any> | null;
    }>
  ): Promise<void> {
    try {
      await Database.transaction(async (trx) => {
        await AuditLog.createMany(
          records.map((record) => ({
            action: record.action,
            entity: record.model_name,
            entity_id: record.record_id,
            user_id: record.user_id,
            old_data: record.old_data,
            new_data: record.new_data,
          })),
          { client: trx }
        );
      });
    } catch (error) {
      console.error('Error creating bulk audit logs:', error);
    }
  }
}
