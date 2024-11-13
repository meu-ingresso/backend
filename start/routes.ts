import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.post('/login', 'v1/AuthController.login');

  // ROTAS COM AUTENTICAÇÃO
  Route.group(() => {
    Route.get('/users', 'v1/UserController.search');
    Route.post('/user', 'v1/UserController.create');
    Route.patch('/user', 'v1/UserController.update');

    Route.get('/roles', 'v1/RoleController.search');
    Route.get('/permissions', 'v1/PermissionController.search');
    Route.get('/roles/permissions', 'v1/RolePermissionController.search');
    Route.post('/role/permission', 'v1/RolePermissionController.create');
    Route.patch('/role/permission', 'v1/RolePermissionController.update');

    Route.get('/logout', 'v1/AuthController.logout');
  }).middleware(['auth']);
}).prefix('v1');
