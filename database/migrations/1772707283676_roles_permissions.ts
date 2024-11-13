import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class NpsSchema extends BaseSchema {
  protected tableName = 'roles_permissions';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('role_id').nullable();
      table.uuid('permission_id').nullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
