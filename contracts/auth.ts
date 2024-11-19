import Api_tokens from 'App/Models/Access/Tokens';

declare module '@ioc:Adonis/Addons/Auth' {
  interface ProvidersList {
    user: {
      implementation: LucidProviderContract<typeof Api_tokens>;
      config: LucidProviderConfig<typeof Api_tokens>;
    };
  }

  interface GuardsList {
    api: {
      implementation: OATGuardContract<'user', 'api'>;
      config: OATGuardConfig<'user'>;
    };
  }
}
