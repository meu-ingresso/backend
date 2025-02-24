import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class RolePermissionsSchema extends BaseSchema {
  protected tableName = 'role_permissions';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('role_id').notNullable().references('id').inTable('roles').onDelete('CASCADE');
      table.uuid('permission_id').notNullable().references('id').inTable('permissions').onDelete('CASCADE');
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
