import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', async () => {
    return { status: 'API is running' };
  });

  Route.get('/health', async () => {
    return { status: 'UP' };
  });
});

Route.group(() => {
  Route.post('/login', 'v1/AuthController.login');
  Route.post('/google-login', 'v1/AuthController.googleLogin');
  Route.post('/people', 'v1/PeopleController.create');
  Route.post('/user', 'v1/UsersController.create');
  Route.get('/showcase/events', 'v1/EventsController.showcase');
  Route.get('/showcase/event-groups', 'v1/EventsController.showcaseGroups');

  Route.post('/event/view', 'v1/EventViewsController.create');

  Route.post('/payment/webhook', 'v1/MercadoPagoController.handleWebhook');

  // ROTAS COM AUTENTICAÇÃO
  Route.group(() => {
    Route.get('/logout', 'v1/AuthController.logout');
    Route.get('/auth/me', 'v1/AuthController.me');

    Route.get('/addresses', 'v1/AddressesController.search');
    Route.post('/address', 'v1/AddressesController.create');
    Route.patch('/address', 'v1/AddressesController.update');
    Route.delete('/address/:id', 'v1/AddressesController.delete');

    Route.get('/states', 'v1/StatesController.search');
    Route.post('/state', 'v1/StatesController.create');
    Route.patch('/state', 'v1/StatesController.update');
    Route.delete('/state/:id', 'v1/StatesController.delete');

    Route.get('/cities', 'v1/CitiesController.search');
    Route.post('/city', 'v1/CitiesController.create');
    Route.patch('/city', 'v1/CitiesController.update');
    Route.delete('/city/:id', 'v1/CitiesController.delete');

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
    Route.delete('/role-permission/:id', 'v1/RolePermissionsController.delete');

    Route.get('/people', 'v1/PeopleController.search');
    Route.patch('/people', 'v1/PeopleController.update');
    Route.delete('/people/:id', 'v1/PeopleController.delete');

    Route.get('/users', 'v1/UsersController.search');
    Route.patch('/user', 'v1/UsersController.update');
    Route.delete('/user/:id', 'v1/UsersController.delete');

    Route.get('/user-attachments', 'v1/UserAttachmentsController.search');
    Route.post('/user-attachment', 'v1/UserAttachmentsController.create');
    Route.patch('/user-attachment', 'v1/UserAttachmentsController.update');
    Route.delete('/user-attachment/:id', 'v1/UserAttachmentsController.delete');

    Route.post('/category', 'v1/CategoriesController.create');
    Route.patch('/category', 'v1/CategoriesController.update');
    Route.delete('/category/:id', 'v1/CategoriesController.delete');

    Route.post('/status', 'v1/StatusesController.create');
    Route.patch('/status', 'v1/StatusesController.update');
    Route.delete('/status/:id', 'v1/StatusesController.delete');

    Route.get('/ratings', 'v1/RatingsController.search');
    Route.post('/rating', 'v1/RatingsController.create');
    Route.patch('/rating', 'v1/RatingsController.update');
    Route.delete('/rating/:id', 'v1/RatingsController.delete');

    Route.get('/events', 'v1/EventsController.search');
    Route.post('/event', 'v1/EventsController.create');
    Route.post('/event/sessions', 'v1/EventsController.createSessions');
    Route.post('/event/duplicate', 'v1/EventsController.duplicateEvent');
    Route.get('/event/validate-alias/:alias', 'v1/EventsController.validateAlias');
    Route.patch('/event', 'v1/EventsController.update');
    Route.delete('/event/:id', 'v1/EventsController.delete');

    Route.post('/event/improve-description', 'v1/OpenAiController.create');

    Route.get('/event-collaborators', 'v1/EventCollaboratorsController.search');
    Route.post('/event-collaborator', 'v1/EventCollaboratorsController.create');
    Route.patch('/event-collaborator', 'v1/EventCollaboratorsController.update');
    Route.delete('/event-collaborator/:id', 'v1/EventCollaboratorsController.delete');

    Route.get('/event-fees', 'v1/EventFeesController.search');
    Route.post('/event-fee', 'v1/EventFeesController.create');
    Route.patch('/event-fee', 'v1/EventFeesController.update');
    Route.delete('/event-fee/:id', 'v1/EventFeesController.delete');

    Route.get('/event-groups', 'v1/EventGroupsController.search');
    Route.post('/event-group', 'v1/EventGroupsController.create');
    Route.delete('/event-group/:id', 'v1/EventGroupsController.delete');

    Route.get('/event-group-relations', 'v1/EventGroupRelationsController.search');
    Route.post('/event-group-relation', 'v1/EventGroupRelationsController.create');
    Route.delete('/event-group-relation/:id', 'v1/EventGroupRelationsController.delete');

    Route.get('/event-attachments', 'v1/EventAttachmentsController.search');
    Route.post('/event-attachment', 'v1/EventAttachmentsController.create');
    Route.patch('/event-attachment', 'v1/EventAttachmentsController.update');
    Route.delete('/event-attachment/:id', 'v1/EventAttachmentsController.delete');

    Route.get('/guest-lists', 'v1/GuestListsController.search');
    Route.post('/guest-list', 'v1/GuestListsController.create');
    Route.patch('/guest-list', 'v1/GuestListsController.update');
    Route.delete('/guest-list/:id', 'v1/GuestListsController.delete');

    Route.get('/guest-list-members', 'v1/GuestListMembersController.search');
    Route.post('/guest-list-member', 'v1/GuestListMembersController.create');
    Route.patch('/guest-list-member', 'v1/GuestListMembersController.update');
    Route.delete('/guest-list-member/:id', 'v1/GuestListMembersController.delete');

    Route.get('/guest-list-members-validated', 'v1/GuestListMembersValidatedController.search');
    Route.post('/guest-list-member-validated', 'v1/GuestListMembersValidatedController.create');
    Route.patch('/guest-list-member-validated', 'v1/GuestListMembersValidatedController.update');
    Route.delete('/guest-list-member-validated/:id', 'v1/GuestListMembersValidatedController.delete');

    Route.get('/pdvs', 'v1/PdvsController.search');
    Route.post('/pdv', 'v1/PdvsController.create');
    Route.patch('/pdv', 'v1/PdvsController.update');
    Route.delete('/pdv/:id', 'v1/PdvsController.delete');

    Route.get('/pdv-users', 'v1/PdvUsersController.search');
    Route.post('/pdv-user', 'v1/PdvUsersController.create');
    Route.delete('/pdv-user/:id', 'v1/PdvUsersController.delete');

    Route.get('/pdv-tickets', 'v1/PdvTicketsController.search');
    Route.post('/pdv-ticket', 'v1/PdvTicketsController.create');
    Route.delete('/pdv-ticket/:id', 'v1/PdvTicketsController.delete');

    Route.get('/event-checkout-fields', 'v1/EventCheckoutFieldsController.search');
    Route.post('/event-checkout-field', 'v1/EventCheckoutFieldsController.create');
    Route.patch('/event-checkout-field', 'v1/EventCheckoutFieldsController.update');
    Route.delete('/event-checkout-field/:id', 'v1/EventCheckoutFieldsController.delete');

    Route.get('/event-checkout-field-options', 'v1/EventCheckoutFieldOptionsController.search');
    Route.post('/event-checkout-field-option', 'v1/EventCheckoutFieldOptionsController.create');
    Route.patch('/event-checkout-field-option', 'v1/EventCheckoutFieldOptionsController.update');
    Route.delete('/event-checkout-field-option/:id', 'v1/EventCheckoutFieldOptionsController.delete');

    Route.get('/event-checkout-fields-tickets', 'v1/EventCheckoutFieldsTicketsController.search');
    Route.post('/event-checkout-field-ticket', 'v1/EventCheckoutFieldsTicketsController.create');
    Route.delete('/event-checkout-field-ticket/:id', 'v1/EventCheckoutFieldsTicketsController.delete');

    Route.get('/tickets', 'v1/TicketsController.search');
    Route.post('/ticket', 'v1/TicketsController.create');
    Route.patch('/ticket', 'v1/TicketsController.update');
    Route.delete('/ticket/:id', 'v1/TicketsController.delete');

    Route.get('/ticket-fields', 'v1/TicketFieldsController.search');
    Route.post('/ticket-field', 'v1/TicketFieldsController.create');
    Route.patch('/ticket-field', 'v1/TicketFieldsController.update');
    Route.delete('/ticket-field/:id', 'v1/TicketFieldsController.delete');

    Route.get('/ticket-event-categories', 'v1/TicketEventCategoriesController.search');
    Route.post('/ticket-event-category', 'v1/TicketEventCategoriesController.create');
    Route.patch('/ticket-event-category', 'v1/TicketEventCategoriesController.update');
    Route.delete('/ticket-event-category/:id', 'v1/TicketEventCategoriesController.delete');

    Route.get('/coupons', 'v1/CouponsController.search');
    Route.post('/coupon', 'v1/CouponsController.create');
    Route.patch('/coupon', 'v1/CouponsController.update');
    Route.delete('/coupon/:id', 'v1/CouponsController.delete');

    Route.get('/coupons-tickets', 'v1/CouponsTicketsController.search');
    Route.post('/coupon-ticket', 'v1/CouponsTicketsController.create');
    Route.delete('/coupon-ticket/:id', 'v1/CouponsTicketsController.delete');

    Route.get('/customer-tickets', 'v1/CustomerTicketsController.search');
    Route.post('/customer-ticket', 'v1/CustomerTicketsController.create');
    Route.patch('/customer-ticket', 'v1/CustomerTicketsController.update');
    Route.delete('/customer-ticket/:id', 'v1/CustomerTicketsController.delete');

    Route.get('/parameters', 'v1/ParametersController.search');
    Route.post('/parameter', 'v1/ParametersController.create');
    Route.patch('/parameter', 'v1/ParametersController.update');
    Route.delete('/parameter/:id', 'v1/ParametersController.delete');

    Route.get('/notifications', 'v1/NotificationsController.search');
    Route.post('/notification', 'v1/NotificationsController.create');
    Route.patch('/notification/', 'v1/NotificationsController.update');
    Route.delete('/notification/:id', 'v1/NotificationsController.delete');

    Route.post('/upload', 'v1/AwsController.create');

    // PAYMENTS
    Route.get('/payments', 'v1/PaymentsController.search');
    Route.post('/payment', 'v1/PaymentsController.create');
    Route.patch('/payment', 'v1/PaymentsController.update');
    Route.delete('/payment/:id', 'v1/PaymentsController.delete');
  }).middleware(['auth']);

  // ROTAS SEM AUTENTICAÇÃO
  Route.group(() => {
    Route.post('/ticket-reservation', 'v1/TicketReservationsController.create');

    Route.post('/payment/card', 'v1/MercadoPagoController.processCardPayment');
    Route.post('/payment/pix', 'v1/MercadoPagoController.processPixPayment');
    Route.post('/payment/pdv', 'v1/PaymentsController.processPdvPayment');
    Route.get('/payment/:id', 'v1/MercadoPagoController.getPayment');
    Route.post('/payment/refund/:id', 'v1/MercadoPagoController.refundPayment');

    Route.get('/categories', 'v1/CategoriesController.search');
    Route.get('/statuses', 'v1/StatusesController.search');
    Route.get('/promoter/:alias/events', 'v1/EventsController.getByPromoterAlias');
    Route.get('/events/top-active-by-category', 'v1/EventsController.topActiveByCategory');

    Route.post('/send-mail', 'v1/SendMailController.sendMail');

    // Validação de cupom sem autenticação
    Route.post('/coupon/validate', 'v1/CouponsController.validateCoupon').middleware(['rateLimit']);
  });
}).prefix('v1');
