import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddUniqueIndexToEventsSchema extends BaseSchema {
  protected tableName = 'events';

  public async up() {
    // Primeiro busca o ID do status "Reprovado"
    const status = await this.db
      .rawQuery(
        `
      SELECT id FROM statuses 
      WHERE name = 'Reprovado' 
      AND module = 'event'
      AND deleted_at IS NULL
      LIMIT 1
    `
      )
      .then((result) => result.rows[0]);

    if (!status) {
      throw new Error('Status "Reprovado" não encontrado');
    }

    // Verifica se existem violações
    const violations = await this.db
      .rawQuery(
        `
      SELECT alias, COUNT(*) as count
      FROM ${this.tableName}
      WHERE status_id != '${status.id}'
      AND deleted_at IS NULL
      GROUP BY alias
      HAVING COUNT(*) > 1
    `
      )
      .then((result) => result.rows);

    if (violations.length > 0) {
      console.log('Encontradas as seguintes violações:');
      violations.forEach((v) => {
        console.log(`Alias "${v.alias}" tem ${v.count} eventos`);
      });
      throw new Error(
        'Existem eventos que violam a restrição de unicidade. Por favor, corrija os dados antes de criar o índice.'
      );
    }

    // Se não houver violações, cria o índice
    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS events_unique_alias_status 
      ON ${this.tableName} (alias) 
      WHERE status_id != '${status.id}'
      AND deleted_at IS NULL
    `);
  }

  public async down() {
    await this.db.rawQuery(`
      DROP INDEX IF EXISTS events_unique_alias_status
    `);
  }
}
