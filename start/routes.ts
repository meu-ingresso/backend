import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/health', async () => {
    return { status: 'UP' };
  });

  Route.get('/', async () => {
    return { status: 'API is running' };
  });

  Route.post('/login', 'v1/AuthController.login');
  Route.post('/people', 'v1/PeopleController.create');
  Route.post('/user', 'v1/UsersController.create');

  // ROTAS COM AUTENTICAÇÃO
  Route.group(() => {
    Route.get('/logout', 'v1/AuthController.logout');

    Route.get('/addresses', 'v1/AddressesController.search');
    Route.post('/address', 'v1/AddressesController.create');
    Route.patch('/address', 'v1/AddressesController.update');
    Route.delete('/address/:id', 'v1/AddressesController.delete');

    Route.get('/cities', 'v1/CitiesController.search');
    Route.post('/city', 'v1/CitiesController.create');
    Route.patch('/city', 'v1/CitiesController.update');
    Route.delete('/city/:id', 'v1/CitiesController.delete');

    Route.get('/states', 'v1/StatesController.search');
    Route.post('/state', 'v1/StatesController.create');
    Route.patch('/state', 'v1/StatesController.update');
    Route.delete('/state/:id', 'v1/StatesController.delete');

    Route.get('/roles', 'v1/RolesController.search');
    Route.post('/role', 'v1/RolesController.create');
    Route.patch('/role', 'v1/RolesController.update');
    Route.delete('/role/:id', 'v1/RolesController.delete');

    Route.get('/permissions', 'v1/PermissionsController.search');
    Route.post('/permission', 'v1/PermissionsController.create');
    Route.patch('/permission', 'v1/PermissionsController.update');
    Route.delete('/permission/:id', 'v1/PermissionsController.delete');

    Route.get('/role-permissions', 'v1/RolePermissionsController.search');
    Route.post('/role-permission', 'v1/RolePermissionsController.create');
    Route.patch('/role-permission', 'v1/RolePermissionsController.update');

    Route.get('/people', 'v1/PeopleController.search');
    Route.patch('/people', 'v1/PeopleController.update');
    Route.delete('/people/:id', 'v1/PeopleController.delete');

    Route.get('/users', 'v1/UsersController.search');
    Route.patch('/user', 'v1/UsersController.update');
    Route.delete('/user/:id', 'v1/UsersController.delete');

    Route.get('/categories', 'v1/CategoriesController.search');
    Route.post('/category', 'v1/CategoriesController.create');
    Route.patch('/category', 'v1/CategoriesController.update');
    Route.delete('/category/:id', 'v1/CategoriesController.delete');

    Route.get('/statuses', 'v1/StatusesController.search');
    Route.post('/status', 'v1/StatusesController.create');
    Route.patch('/status', 'v1/StatusesController.update');
    Route.delete('/status/:id', 'v1/StatusesController.delete');

    Route.get('/ratings', 'v1/RatingsController.search');
    Route.post('/rating', 'v1/RatingsController.create');
    Route.patch('/rating', 'v1/RatingsController.update');
    Route.delete('/rating/:id', 'v1/RatingsController.delete');

    Route.get('/events', 'v1/EventsController.search');
    Route.post('/event', 'v1/EventsController.create');
    Route.get('/event/validate-alias/:alias', 'v1/EventsController.validateAlias');
    Route.patch('/event', 'v1/EventsController.update');
    Route.delete('/event/:id', 'v1/EventsController.delete');

    Route.get('/event-collaborators', 'v1/EventCollaboratorsController.search');
    Route.post('/event-collaborator', 'v1/EventCollaboratorsController.create');
    Route.patch('/event-collaborator', 'v1/EventCollaboratorsController.update');
    Route.delete('/event-collaborator/:id', 'v1/EventCollaboratorsController.delete');

    Route.get('/event-fees', 'v1/EventFeesController.search');
    Route.post('/event-fee', 'v1/EventFeesController.create');
    Route.patch('/event-fee', 'v1/EventFeesController.update');
    Route.delete('/event-fee/:id', 'v1/EventFeesController.delete');

    Route.get('/tickets', 'v1/TicketsController.search');
    Route.post('/ticket', 'v1/TicketsController.create');
    Route.patch('/ticket', 'v1/TicketsController.update');
    Route.delete('/ticket/:id', 'v1/TicketsController.delete');

    Route.get('/coupons', 'v1/CouponsController.search');
    Route.post('/coupon', 'v1/CouponsController.create');
    Route.patch('/coupon', 'v1/CouponsController.update');
    Route.delete('/coupon/:id', 'v1/CouponsController.delete');

    Route.get('/customer-tickets', 'v1/CustomerTicketsController.search');
    Route.post('/customer-ticket', 'v1/CustomerTicketsController.create');
    Route.patch('/customer-ticket', 'v1/CustomerTicketsController.update');
    Route.delete('/customer-ticket/:id', 'v1/CustomerTicketsController.delete');

    Route.get('/payments', 'v1/PaymentsController.search');
    Route.post('/payment', 'v1/PaymentsController.create');
    Route.patch('/payment', 'v1/PaymentsController.update');
    Route.delete('/payment/:id', 'v1/PaymentsController.delete');

    Route.get('/parameters', 'v1/ParametersController.search');
    Route.post('/parameter', 'v1/ParametersController.create');
    Route.patch('/parameter', 'v1/ParametersController.update');
    Route.delete('/parameter/:id', 'v1/ParametersController.delete');
  }).middleware(['auth']);
}).prefix('v1');
