import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import Hash from '@ioc:Adonis/Core/Hash';
import Role from 'App/Models/Access/Roles';
import Permission from 'App/Models/Access/Permissions';
import RolePermission from 'App/Models/Access/RolePermissions';
import People from 'App/Models/Access/People';
import User from 'App/Models/Access/Users';
import State from 'App/Models/Access/States';
import City from 'App/Models/Access/Cities';
import Category from 'App/Models/Access/Categories';
import Status from 'App/Models/Access/Statuses';
import Rating from 'App/Models/Access/Ratings';
import Event from 'App/Models/Access/Events';
import EventCollaborator from 'App/Models/Access/EventCollaborators';
import EventFee from 'App/Models/Access/EventFees';
import EventAttachment from 'App/Models/Access/EventAttachments';
import Ticket from 'App/Models/Access/Tickets';
import TicketEventCategory from 'App/Models/Access/TicketEventCategories';
import Parameter from 'App/Models/Access/Parameters';
import Addresses from 'App/Models/Access/Addresses';
import Payments from 'App/Models/Access/Payments';
import CustomerTickets from 'App/Models/Access/CustomerTickets';
import Coupon from 'App/Models/Access/Coupons';

export default class DatabaseSeeder extends BaseSeeder {
  public async run() {
    // Roles
    const roles = await Role.createMany([
      { id: uuidv4(), name: 'Admin', created_at: DateTime.now(), updated_at: DateTime.now() },
      { id: uuidv4(), name: 'Promoter', created_at: DateTime.now(), updated_at: DateTime.now() },
      { id: uuidv4(), name: 'Assistant', created_at: DateTime.now(), updated_at: DateTime.now() },
      { id: uuidv4(), name: 'Cliente', created_at: DateTime.now(), updated_at: DateTime.now() },
    ]);

    console.log('Roles created');

    // Permissions
    const permissions = await Permission.createMany([
      { id: uuidv4(), name: 'manage-events', description: 'Permission to manage events' },
      { id: uuidv4(), name: 'watch-events', description: 'Permission to watch events' },
    ]);

    console.log('Permissions created');

    // Role Permissions
    await RolePermission.createMany([
      { id: uuidv4(), role_id: roles[0].id, permission_id: permissions[0].id },
      { id: uuidv4(), role_id: roles[1].id, permission_id: permissions[0].id },
      { id: uuidv4(), role_id: roles[2].id, permission_id: permissions[1].id },
    ]);

    console.log('Role Permissions created');

    // People
    const people = await People.createMany([
      {
        id: uuidv4(),
        first_name: 'Jean',
        last_name: 'Promotor',
        email: 'jean@gmail.com',
        person_type: 'PF',
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      },
      {
        id: uuidv4(),
        first_name: 'System',
        last_name: 'Administrator',
        email: 'admin@gmail.com',
        person_type: 'PJ',
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      },
      {
        id: uuidv4(),
        first_name: 'Cliente',
        last_name: 'Final',
        email: 'cliente@gmail.com',
        person_type: 'PJ',
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      },
    ]);

    console.log('People created');

    // Users
    const users = await User.createMany([
      {
        id: uuidv4(),
        people_id: people[0].id,
        email: 'jean@gmail.com',
        alias: 'jean-promotor',
        password: await Hash.make('123456'),
        role_id: roles[1].id,
      },
      {
        id: uuidv4(),
        people_id: people[1].id,
        email: 'admin@gmail.com',
        alias: 'system-administrator',
        password: await Hash.make('123456'),
        role_id: roles[0].id,
      },
      {
        id: uuidv4(),
        people_id: people[2].id,
        email: 'cliente@gmail.com',
        alias: 'cliente-final',
        password: await Hash.make('123456'),
        role_id: roles[2].id,
      },
    ]);

    console.log('Users created');

    // States
    const states = await State.createMany([
      { id: uuidv4(), name: 'Santa Catarina', acronym: 'SC' },
      { id: uuidv4(), name: 'São Paulo', acronym: 'SP' },
    ]);

    console.log('States created');

    // Cities
    const city = await City.createMany([
      { id: uuidv4(), name: 'Itajaí', state_id: states[0].id },
      { id: uuidv4(), name: 'São Paulo', state_id: states[1].id },
    ]);

    console.log('Cities created');

    // Addresses
    const address = await Addresses.createMany([
      {
        id: uuidv4(),
        street: 'Rua Gelásio Pedro de Miranda',
        zipcode: '88309305',
        number: '102',
        neighborhood: 'São Vicente',
        city: city[0].name,
        state: states[0].name,
      },
      {
        id: uuidv4(),
        street: 'Rua 123',
        zipcode: '88309305',
        number: '456',
        neighborhood: 'Centro',
        city: city[1].name,
        state: states[1].name,
      },
    ]);

    console.log('Addresses created');

    // Categories
    const category = await Category.createMany([
      { id: uuidv4(), name: 'Show, música e festa' },
      { id: uuidv4(), name: 'Esportivo' },
      { id: uuidv4(), name: 'Congresso e seminários' },
      { id: uuidv4(), name: 'Curso e workshop' },
      { id: uuidv4(), name: 'Encontro e networking' },
      { id: uuidv4(), name: 'Feira e exposição' },
      { id: uuidv4(), name: 'Filme, cinema e teatro' },
      { id: uuidv4(), name: 'Gastronômico' },
      { id: uuidv4(), name: 'Religioso e espiritual' },
      { id: uuidv4(), name: 'E-sports' },
      { id: uuidv4(), name: 'Outros' },
    ]);

    console.log('Categories created');

    // Statuses
    const statuses = await Status.createMany([
      { id: uuidv4(), name: 'À Venda', description: 'Ingresso a venda', module: 'ticket' },
      { id: uuidv4(), name: 'Esgotado', description: 'Ingressos esgotados', module: 'ticket' },
      {
        id: uuidv4(),
        name: 'Publicado',
        description: 'Evento publicado (pós aprovação pela equipe Meu Ingresso)',
        module: 'event',
      },
      {
        id: uuidv4(),
        name: 'Rascunho',
        description: 'Evento em rascunho (Antes de envio para publicação)',
        module: 'event',
      },
      {
        id: uuidv4(),
        name: 'Aguardando Aprovação',
        description: 'Evento publicado pelo promoter, mas aguardando aprovaçnao da Equipe Meu Ingresso)',
        module: 'event',
      },
      { id: uuidv4(), name: 'Aprovado', description: 'Pagamento Aprovado', module: 'payment' },
      { id: uuidv4(), name: 'Disponível', description: 'Disponível para check-in', module: 'ticket' },
      {
        id: uuidv4(),
        name: 'Validado',
        description: 'Indisponível para uso; Ingresso já validado na portaria',
        module: 'ticket',
      },
      { id: uuidv4(), name: 'Disponível', description: 'Cupom Disponível para uso', module: 'coupon' },
      { id: uuidv4(), name: 'Esgotado', description: 'Cupom Indisponível para uso', module: 'coupon' },
      { id: uuidv4(), name: 'Reprovado', description: 'Evento reprovado pela equipe Meu Ingresso', module: 'event' },
    ]);

    console.log('Statuses created');

    // Ratings
    const rating = await Rating.createMany([
      {
        id: uuidv4(),
        name: '18+',
        description: 'Proibido para menores de 18 anos',
        image: 'https://meuingresso-attachments.s3.us-east-1.amazonaws.com/%2B18.png',
      },
      {
        id: uuidv4(),
        name: '16+',
        description: 'Maiores de 16 anos',
        image: 'https://meuingresso-attachments.s3.us-east-1.amazonaws.com/%2B16.png',
      },
      {
        id: uuidv4(),
        name: '14+',
        description: 'Maiores de 14 anos',
        image: 'https://meuingresso-attachments.s3.us-east-1.amazonaws.com/%2B14.png',
      },
      {
        id: uuidv4(),
        name: 'Livre',
        description: 'Livre para todas as idades',
        image: 'https://meuingresso-attachments.s3.us-east-1.amazonaws.com/Livre.png',
      },
    ]);

    console.log('Ratings created');

    // Events
    const events = await Event.createMany([
      {
        id: uuidv4(),
        alias: 'festival-de-musica',
        name: 'Festival de Música',
        description: 'Festival de música eletrônica com DJ ALOK',
        category_id: category[0].id,
        rating_id: rating[1].id,
        status_id: statuses[2].id,
        address_id: address[0].id,
        promoter_id: users[0].id,
        start_date: DateTime.now(),
        end_date: DateTime.now().plus({ days: 10 }),
        contact: '47 99999-9999',
        location_name: 'Green Valley',
        general_information: 'O evento é uma produção de GDO',
        is_featured: true,
        sale_type: 'Ingresso',
        event_type: 'Presencial',
      },
      {
        id: uuidv4(),
        alias: 'partida-de-futebol',
        name: 'Partida de Futebol',
        description: 'Partida de futebol entre São Paulo e Flamengo',
        category_id: category[1].id,
        rating_id: rating[0].id,
        status_id: statuses[2].id,
        address_id: address[1].id,
        promoter_id: users[1].id,
        start_date: DateTime.now(),
        end_date: DateTime.now().plus({ days: 10 }),
        contact: '47 99999-9999',
        location_name: 'Estádio do Morumbi',
        general_information: 'Ultimo jogo do campeonato Brasileiro',
        is_featured: false,
        sale_type: 'Ingresso',
        event_type: 'Online',
      },
    ]);

    console.log('Events created');

    const assistant = await Role.findBy('name', 'Assistant');

    await EventCollaborator.createMany([
      { id: uuidv4(), event_id: events[1].id, user_id: users[0].id, role_id: assistant?.$attributes.id },
    ]);

    console.log('Event Collaborators created');

    // Event Fees
    await EventFee.createMany([
      {
        id: uuidv4(),
        event_id: events[0].id,
        platform_fee: 5.0,
        promoter_fee: 10.0,
        fixed_fee: 2.0,
      },
      {
        id: uuidv4(),
        event_id: events[1].id,
        platform_fee: 3.0,
        promoter_fee: 7.0,
        fixed_fee: 1.5,
      },
    ]);

    console.log('Event Fees created');

    // Event Attachments
    await EventAttachment.createMany([
      {
        id: uuidv4(),
        event_id: events[0].id,
        name: 'banner',
        type: 'image',
        image_url:
          'https://d2s7f8q1bxluur.cloudfront.net/gYXnIIwLdURfffTGlV4yNiHTGLs=/545x286/https%3A//s3-sa-east-1.amazonaws.com/s3-eventos-saas/media/eventos/481c26e8-1fdb-4c6d-8c1c-cd73f27c5f09.png',
      },
      {
        id: uuidv4(),
        event_id: events[1].id,
        name: 'banner',
        type: 'image',
        image_url:
          'https://d2s7f8q1bxluur.cloudfront.net/s0cm4rOhDrRqKHiQzBZGDfkJae4=/545x286/https%3A//s3-sa-east-1.amazonaws.com/s3-eventos-saas/media/eventos/12d2eece-0439-410c-a0fa-a9da8a3d4402.png',
      },
    ]);

    console.log('Event Attachments created');

    const ticketEventCategories = await TicketEventCategory.createMany([
      { id: uuidv4(), name: 'VIP', event_id: events[0].id },
      { id: uuidv4(), name: 'Pista', event_id: events[0].id },
      { id: uuidv4(), name: 'VIP', event_id: events[1].id },
      { id: uuidv4(), name: 'Camarote', event_id: events[1].id },
    ]);

    console.log('Ticket Event Categories created');

    // Tickets
    const ticket = await Ticket.createMany([
      {
        id: uuidv4(),
        event_id: events[0].id,
        ticket_event_category_id: ticketEventCategories[0].id,
        name: 'Masculino',
        total_quantity: 100,
        remaining_quantity: 80,
        price: 150.0,
        status_id: statuses[0].id,
        start_date: DateTime.now(),
        display_order: 1,
        end_date: DateTime.now().plus({ days: 10 }),
      },
      {
        id: uuidv4(),
        event_id: events[0].id,
        ticket_event_category_id: ticketEventCategories[0].id,
        name: 'Feminino',
        total_quantity: 50,
        remaining_quantity: 50,
        price: 100.0,
        status_id: statuses[0].id,
        start_date: DateTime.now(),
        end_date: DateTime.now().plus({ days: 10 }),
        display_order: 2,
      },
      {
        id: uuidv4(),
        event_id: events[1].id,
        ticket_event_category_id: ticketEventCategories[3].id,
        name: 'Camarote',
        total_quantity: 10,
        remaining_quantity: 8,
        price: 500.0,
        status_id: statuses[0].id,
        start_date: DateTime.now(),
        end_date: DateTime.now().plus({ days: 10 }),
        display_order: 1,
      },
    ]);

    console.log('Tickets created');

    // Payments
    const payment = await Payments.createMany([
      {
        id: uuidv4(),
        user_id: users[2].id,
        status_id: statuses[5].id,
        payment_method: 'pix',
        gross_value: 20.0,
        net_value: 19.0,
        created_at: DateTime.now(),
      },
      {
        id: uuidv4(),
        user_id: users[2].id,
        status_id: statuses[5].id,
        payment_method: 'credit',
        gross_value: 29.0,
        net_value: 25.0,
        created_at: DateTime.now(),
      },
    ]);

    console.log('Payments created');

    // Customer Tickets
    await CustomerTickets.createMany([
      {
        id: uuidv4(),
        ticket_id: ticket[0].id,
        current_owner_id: people[2].id,
        status_id: statuses[6].id,
        payment_id: payment[0].id,
        ticket_identifier: 'ARG5AD',
        created_at: DateTime.now(),
      },
      {
        id: uuidv4(),
        ticket_id: ticket[1].id,
        current_owner_id: people[2].id,
        status_id: statuses[7].id,
        payment_id: payment[1].id,
        ticket_identifier: '1AGTAD',
        created_at: DateTime.now(),
      },
    ]);

    console.log('Customer Tickets created');

    // Parameters
    await Parameter.createMany([
      { id: uuidv4(), key: 'site_name', value: 'Event Platform', description: 'Name of the platform' },
      { id: uuidv4(), key: 'support_email', value: 'support@example.com', description: 'Support contact email' },
    ]);

    console.log('Parameters created');

    await Coupon.createMany([
      {
        id: uuidv4(),
        event_id: events[0].id,
        code: 'KELVYN10',
        discount_type: 'PERCENTAGE',
        discount_value: 10,
        max_uses: 100,
        start_date: DateTime.now(),
        end_date: DateTime.now().plus({ days: 10 }),
        status_id: statuses[8].id,
      },
      {
        id: uuidv4(),
        event_id: events[0].id,
        code: 'JEAN15',
        discount_type: 'FIXED',
        discount_value: 15,
        max_uses: 2,
        start_date: DateTime.now(),
        end_date: DateTime.now().plus({ days: 10 }),
        status_id: statuses[8].id,
      },
    ]);

    console.log('Coupons created');
  }
}
