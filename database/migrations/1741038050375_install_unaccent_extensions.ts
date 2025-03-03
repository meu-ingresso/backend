import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'install_unaccent_extension';

  public async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS unaccent');
  }

  public async down() {
    this.schema.raw('DROP EXTENSION IF EXISTS unaccent');
  }
}
