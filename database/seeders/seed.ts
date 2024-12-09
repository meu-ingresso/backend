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

export default class DatabaseSeeder extends BaseSeeder {
  public async run() {
    // Roles
    const roles = await Role.createMany([
      { id: uuidv4(), name: 'Admin', created_at: DateTime.now(), updated_at: DateTime.now() },
      { id: uuidv4(), name: 'Promoter', created_at: DateTime.now(), updated_at: DateTime.now() },
      { id: uuidv4(), name: 'Assistant', created_at: DateTime.now(), updated_at: DateTime.now() },
    ]);

    // Permissions
    const permissions = await Permission.createMany([
      { id: uuidv4(), name: 'create-event', description: 'Permission to create events' },
      { id: uuidv4(), name: 'manage-users', description: 'Permission to manage users' },
    ]);

    // Role Permissions
    await RolePermission.createMany([
      { id: uuidv4(), role_id: roles[0].id, permission_id: permissions[0].id },
      { id: uuidv4(), role_id: roles[1].id, permission_id: permissions[1].id },
    ]);

    // People
    const people = await People.createMany([
      {
        id: uuidv4(),
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        person_type: 'PF',
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      },
      {
        id: uuidv4(),
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        person_type: 'PJ',
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      },
    ]);

    // Users
    const users = await User.createMany([
      {
        id: uuidv4(),
        people_id: people[0].id,
        email: 'admin@example.com',
        password: await Hash.make('password123'), // Criptografando a senha
        role_id: roles[0].id,
        is_active: true,
      },
      {
        id: uuidv4(),
        people_id: people[1].id,
        email: 'promoter@example.com',
        password: await Hash.make('password123'), // Criptografando a senha
        role_id: roles[1].id,
        is_active: true,
      },
    ]);

    // States
    const states = await State.createMany([
      { id: uuidv4(), name: 'Santa Catarina', acronym: 'SC' },
      { id: uuidv4(), name: 'São Paulo', acronym: 'SP' },
    ]);

    // Cities
    await City.createMany([
      { id: uuidv4(), name: 'Florianópolis', state_id: states[0].id },
      { id: uuidv4(), name: 'São Paulo', state_id: states[1].id },
    ]);

    // Categories
    await Category.createMany([
      { id: uuidv4(), name: 'Music', is_active: true },
      { id: uuidv4(), name: 'Sports', is_active: true },
    ]);

    // Statuses
    const statuses = await Status.createMany([
      { id: uuidv4(), name: 'Active', module: 'event' },
      { id: uuidv4(), name: 'Inactive', module: 'event' },
    ]);

    // Ratings
    await Rating.createMany([
      { id: uuidv4(), name: 'General Audience' },
      { id: uuidv4(), name: '18+' },
    ]);

    // Events
    const events = await Event.createMany([
      {
        id: uuidv4(),
        name: 'Music Festival',
        status_id: statuses[0].id,
        promoter_id: users[1].id,
        start_date: DateTime.now(),
        type: 'Ingresso',
      },
      {
        id: uuidv4(),
        name: 'Football Match',
        status_id: statuses[0].id,
        promoter_id: users[1].id,
        start_date: DateTime.now(),
        type: 'Ingresso',
      },
    ]);

    const assistant = await Role.findBy('name', 'Assistant');

    await EventCollaborator.createMany([
      { id: uuidv4(), event_id: events[0].id, user_id: users[1].id, role_id: assistant?.$attributes.id },
      { id: uuidv4(), event_id: events[1].id, user_id: users[1].id, role_id: assistant?.$attributes.id },
    ]);

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

    // Event Attachments
    await EventAttachment.createMany([
      { id: uuidv4(), event_id: events[0].id, name: 'Banner', type: 'image', image_url: 'banner1.jpg' },
      { id: uuidv4(), event_id: events[1].id, name: 'Poster', type: 'image', image_url: 'poster1.jpg' },
    ]);

    const ticketEventCategories = await TicketEventCategory.createMany([
      { id: uuidv4(), name: 'VIP', event_id: events[0].id },
      { id: uuidv4(), name: 'General', event_id: events[1].id },
    ]);

    // Tickets
    await Ticket.createMany([
      {
        id: uuidv4(),
        event_id: events[0].id,
        ticket_event_category_id: ticketEventCategories[0].id,
        name: 'VIP',
        total_quantity: 100,
        remaining_quantity: 80,
        price: 150.0,
        status_id: statuses[0].id,
        start_date: DateTime.now(),
        end_date: DateTime.now().plus({ days: 10 }),
      },
      {
        id: uuidv4(),
        event_id: events[1].id,
        ticket_event_category_id: ticketEventCategories[1].id,
        name: 'Standard',
        total_quantity: 200,
        remaining_quantity: 180,
        price: 50.0,
        status_id: statuses[0].id,
        start_date: DateTime.now(),
        end_date: DateTime.now().plus({ days: 10 }),
      },
    ]);

    // Parameters
    await Parameter.createMany([
      { id: uuidv4(), key: 'site_name', value: 'Event Platform', description: 'Name of the platform' },
      { id: uuidv4(), key: 'support_email', value: 'support@example.com', description: 'Support contact email' },
    ]);
  }
}
