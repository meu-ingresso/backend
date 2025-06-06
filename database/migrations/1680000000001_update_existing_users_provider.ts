import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UpdateExistingUsersProviderSchema extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    // Atualiza todos os usuários existentes para ter provider 'DEFAULT'
    // se não tiverem provider definido
    this.defer(async (db) => {
      await db.from(this.tableName).whereNull('provider').update({ provider: 'DEFAULT' });
    });
  }

  public async down() {
    // Em caso de rollback, volta para NULL
    this.defer(async (db) => {
      await db.from(this.tableName).where('provider', 'DEFAULT').update({ provider: null });
    });
  }
} 