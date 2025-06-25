import Server from '@ioc:Adonis/Core/Server';

Server.middleware.register([() => import('@ioc:Adonis/Core/BodyParser')]);

Server.middleware.registerNamed({
  auth: () => import('App/Middlewares/Auth'),
  authApiKey: () => import('App/Middlewares/AuthApiKey'),
  externalAuth: () => import('App/Middlewares/ExternalAuth'),
  EventAccess: () => import('App/Middlewares/EventAccess'),
  rateLimit: () => import('App/Middlewares/RateLimit'),
});
