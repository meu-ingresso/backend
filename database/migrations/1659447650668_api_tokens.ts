import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  public async up() {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await this.db.rawQuery(`
      CREATE TABLE api_tokens (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        token VARCHAR(64) NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL
      );
    `);
  }

  public async down() {
    await this.db.rawQuery('DROP TABLE IF EXISTS api_tokens');
    await this.db.rawQuery('DROP EXTENSION IF EXISTS "uuid-ossp"');
  }
}
