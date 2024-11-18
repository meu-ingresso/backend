import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.post('/login', 'v1/AuthController.login');

  Route.get('/addresses', 'v1/AddressesController.search');
  Route.post('/address', 'v1/AddressesController.create');
  Route.patch('/address', 'v1/AddressesController.update');

  Route.get('/cities', 'v1/CitiesController.search');
  Route.post('/city', 'v1/CitiesController.create');
  Route.patch('/city', 'v1/CitiesController.update');

  Route.get('/states', 'v1/StatesController.search');
  Route.post('/state', 'v1/StatesController.create');
  Route.patch('/state', 'v1/StatesController.update');

  Route.get('/roles', 'v1/RolesController.search');
  Route.post('/role', 'v1/RolesController.create');
  Route.patch('/role', 'v1/RolesController.update');

  Route.get('/permissions', 'v1/PermissionsController.search');
  Route.post('/permission', 'v1/PermissionsController.create');
  Route.patch('/permission', 'v1/PermissionsController.update');

  Route.get('/role-permissions', 'v1/RolePermissionsController.search');
  Route.post('/role-permission', 'v1/RolePermissionsController.create');
  Route.patch('/role-permission', 'v1/RolePermissionsController.update');

  Route.get('/people', 'v1/PeopleController.search');
  Route.post('/people', 'v1/PeopleController.create');
  Route.patch('/people', 'v1/PeopleController.update');

  Route.get('/users', 'v1/UsersController.search');
  Route.post('/user', 'v1/UsersController.create');
  Route.patch('/user', 'v1/UsersController.update');

  Route.get('/categories', 'v1/CategoriesController.search');
  Route.post('/category', 'v1/CategoriesController.create');
  Route.patch('/category', 'v1/CategoriesController.update');

  Route.get('/statuses', 'v1/StatusesController.search');
  Route.post('/status', 'v1/StatusesController.create');
  Route.patch('/status', 'v1/StatusesController.update');

  Route.get('/ratings', 'v1/RatingsController.search');
  Route.post('/rating', 'v1/RatingsController.create');
  Route.patch('/rating', 'v1/RatingsController.update');

  Route.get('/events', 'v1/EventsController.search');
  Route.post('/event', 'v1/EventsController.create');
  Route.patch('/event', 'v1/EventsController.update');

  Route.get('/event-collaborators', 'v1/EventCollaboratorsController.search');
  Route.post('/event-collaborator', 'v1/EventCollaboratorsController.create');
  Route.patch('/event-collaborator', 'v1/EventCollaboratorsController.update');

  Route.get('/event-fees', 'v1/EventFeesController.search');
  Route.post('/event-fee', 'v1/EventFeesController.create');
  Route.patch('/event-fee', 'v1/EventFeesController.update');

  Route.get('/tickets', 'v1/TicketsController.search');
  Route.post('/ticket', 'v1/TicketsController.create');
  Route.patch('/ticket', 'v1/TicketsController.update');

  // ROTAS COM AUTENTICAÇÃO
  Route.group(() => {
    Route.get('/logout', 'v1/AuthController.logout');
  }).middleware(['auth']);
}).prefix('v1');
