import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
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
import Parameter from 'App/Models/Access/Parameters';

export default class DatabaseSeeder extends BaseSeeder {
  public async run() {
    // Roles
    const roles = await Role.createMany([
      {
        id: uuidv4(),
        name: 'Admin',
        description: 'Administrador do sistema',
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
      {
        id: uuidv4(),
        name: 'Gerente',
        description: 'Pode editar todo o evento',
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
      {
        id: uuidv4(),
        name: 'PDV (Ponto de venda)',
        description: 'Pode apenas adicionar pedidos pelo PDV no aplicativo e no sistema web.',
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
      {
        id: uuidv4(),
        name: 'Check-in',
        description: 'Pode apenas realizar o controle de entrada de participantes',
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
      {
        id: uuidv4(),
        name: 'Coordenador de Check-in',
        description: 'Pode realizar o controle de entrada, administrar participantes e acessar o PDV',
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
      {
        id: uuidv4(),
        name: 'Cliente',
        description: 'Pode apenas visualizar o evento e comprar ingressos',
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
      {
        id: uuidv4(),
        name: 'Produtor',
        description: 'Pode apenas criar eventos e gerenciar seus eventos',
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
      {
        id: uuidv4(),
        name: 'Financeiro',
        description: 'Pode apenas visualizar os dados financeiros do evento',
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
      {
        id: uuidv4(),
        name: 'Operador',
        description: 'Dados cadastrais do comprador, reenvio do ingresso, troca de titularidade',
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
      {
        id: uuidv4(),
        name: 'Visualização',
        description: 'Pode apenas visualizar os dados do evento',
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
      {
      id: uuidv4(),
        name: 'Analista',
        description: 'Funções do Operador + Alteração completa também no evento',
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
    ]);

    console.log('Roles created');

    // Permissions
    const permissions = await Permission.createMany([
      { id: uuidv4(), name: 'manage-events', description: 'Permission to manage events' },
      { id: uuidv4(), name: 'watch-events', description: 'Permission to watch events' },
      { id: uuidv4(), name: 'view-events', description: 'Permission to view events' },
      { id: uuidv4(), name: 'create-events', description: 'Permission to create events' },
      { id: uuidv4(), name: 'edit-events', description: 'Permission to edit events' },
      { id: uuidv4(), name: 'delete-events', description: 'Permission to delete events' },
      { id: uuidv4(), name: 'export-events', description: 'Permission to export events data' },
      { id: uuidv4(), name: 'add-events-tickets', description: 'Permission to add events tickets' },
      { id: uuidv4(), name: 'add-events-coupons', description: 'Permission to add events coupons' },
      { id: uuidv4(), name: 'add-events-collaborators', description: 'Permission to add events collaborators' },
      { id: uuidv4(), name: 'add-events-guestlist', description: 'Permission to add events guestlist' },
      { id: uuidv4(), name: 'add-events-orders', description: 'Permission to add events orders' },
      { id: uuidv4(), name: 'do-events-checkin', description: 'Permission to do events checkin' },
      { id: uuidv4(), name: 'undo-events-checkin', description: 'Permission to undo events checkin' },
      { id: uuidv4(), name: 'add-events-pdv', description: 'Permission to add events pdv' },
      { id: uuidv4(), name: 'add-events-orders-pdv', description: 'Permission to add events orders pdv' },
      { id: uuidv4(), name: 'edit-events-tickets', description: 'Permission to edit events tickets' },
      { id: uuidv4(), name: 'edit-events-coupons', description: 'Permission to edit events coupons' },
      { id: uuidv4(), name: 'edit-events-collaborators', description: 'Permission to edit events collaborators' },
      { id: uuidv4(), name: 'edit-events-guestlist', description: 'Permission to edit events guestlist' },
      { id: uuidv4(), name: 'edit-events-orders', description: 'Permission to edit events orders' },
      { id: uuidv4(), name: 'edit-events-pdv', description: 'Permission to edit events pdv' },
      { id: uuidv4(), name: 'edit-events-orders-pdv', description: 'Permission to edit events orders pdv' },
      { id: uuidv4(), name: 'delete-events-tickets', description: 'Permission to delete events tickets' },
      { id: uuidv4(), name: 'delete-events-coupons', description: 'Permission to delete events coupons' },
      { id: uuidv4(), name: 'delete-events-collaborators', description: 'Permission to delete events collaborators' },
      { id: uuidv4(), name: 'delete-events-guestlist', description: 'Permission to delete events guestlist' },
      { id: uuidv4(), name: 'delete-events-orders', description: 'Permission to delete events orders' },
      { id: uuidv4(), name: 'delete-events-pdv', description: 'Permission to delete events pdv' },
      { id: uuidv4(), name: 'delete-events-orders-pdv', description: 'Permission to delete events orders pdv' },
      { id: uuidv4(), name: 'view-events-tickets', description: 'Permission to view events tickets' },
      { id: uuidv4(), name: 'view-events-coupons', description: 'Permission to view events coupons' },
      { id: uuidv4(), name: 'view-events-collaborators', description: 'Permission to view events collaborators' },
      { id: uuidv4(), name: 'view-events-guestlist', description: 'Permission to view events guestlist' },
      { id: uuidv4(), name: 'view-events-orders', description: 'Permission to view events orders' },
      { id: uuidv4(), name: 'view-events-checkin', description: 'Permission to view events checkin' },
      { id: uuidv4(), name: 'view-events-pdv', description: 'Permission to view events pdv' },
      { id: uuidv4(), name: 'view-events-orders-pdv', description: 'Permission to view events orders pdv' },
      { id: uuidv4(), name: 'view-events-integrations', description: 'Permission to view events integrations' },
      { id: uuidv4(), name: 'edit-events-integrations', description: 'Permission to edit events integrations' },
      { id: uuidv4(), name: 'resend-events-tickets-from-orders', description: 'Permission to resend events tickets from orders' },
      { id: uuidv4(), name: 'print-events-tickets-from-orders', description: 'Permission to print events tickets from orders' },
      { id: uuidv4(), name: 'cancel-events-orders', description: 'Permission to cancel events orders' },
      { id: uuidv4(), name: 'view-users', description: 'Permission to view users' },
      { id: uuidv4(), name: 'create-users', description: 'Permission to create users' },
      { id: uuidv4(), name: 'edit-users', description: 'Permission to edit users' },
      { id: uuidv4(), name: 'delete-users', description: 'Permission to delete users' },
      { id: uuidv4(), name: 'manage-users-roles', description: 'Permission to manage users roles' },
      { id: uuidv4(), name: 'view-events-general-reports', description: 'Permission to view events general reports' },
      { id: uuidv4(), name: 'view-sales-reports', description: 'Permission to view sales reports' },
      { id: uuidv4(), name: 'view-checkin-reports', description: 'Permission to view checkin reports' },
      { id: uuidv4(), name: 'view-tickets-reports', description: 'Permission to view tickets reports' },
      { id: uuidv4(), name: 'view-users-reports', description: 'Permission to view users reports' },
      { id: uuidv4(), name: 'manage-settings', description: 'Permission to manage settings' },
      { id: uuidv4(), name: 'manage-permissions', description: 'Permission to manage permissions' },
      { id: uuidv4(), name: 'view-producer-page', description: 'Permission to view producer page' },
      { id: uuidv4(), name: 'edit-producer-page', description: 'Permission to edit producer page' },
    ]);

    console.log('Permissions created');

    // Role Permissions
    await RolePermission.createMany([

      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'view-events')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'create-events')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'export-events')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-tickets')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-coupons')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-collaborators')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-guestlist')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-checkin')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-orders-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-integrations')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-tickets')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-coupons')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-collaborators')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-guestlist')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'do-events-checkin')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'undo-events-checkin')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-orders-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-tickets')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-coupons')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-collaborators')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-guestlist')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-orders-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-integrations')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'resend-events-tickets-from-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'print-events-tickets-from-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Gerente')?.id, permission_id: permissions.find(permission => permission.name === 'cancel-events-orders')?.id },

      { id: uuidv4(), role_id: roles.find(role => role.name === 'Coordenador de Check-in')?.id, permission_id: permissions.find(permission => permission.name === 'view-events')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Coordenador de Check-in')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-checkin')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Coordenador de Check-in')?.id, permission_id: permissions.find(permission => permission.name === 'do-events-checkin')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Coordenador de Check-in')?.id, permission_id: permissions.find(permission => permission.name === 'undo-events-checkin')?.id },

      { id: uuidv4(), role_id: roles.find(role => role.name === 'Check-in')?.id, permission_id: permissions.find(permission => permission.name === 'view-events')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Check-in')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-checkin')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Check-in')?.id, permission_id: permissions.find(permission => permission.name === 'do-events-checkin')?.id },

      { id: uuidv4(), role_id: roles.find(role => role.name === 'PDV (Ponto de venda)')?.id, permission_id: permissions.find(permission => permission.name === 'view-events')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'PDV (Ponto de venda)')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'PDV (Ponto de venda)')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-orders-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'PDV (Ponto de venda)')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-orders-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'PDV (Ponto de venda)')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-orders-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'PDV (Ponto de venda)')?.id, permission_id: permissions.find(permission => permission.name === 'resend-events-tickets-from-orders')?.id },

      { id: uuidv4(), role_id: roles.find(role => role.name === 'Visualização')?.id, permission_id: permissions.find(permission => permission.name === 'view-events')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Visualização')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-tickets')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Visualização')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-coupons')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Visualização')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-collaborators')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Visualização')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-guestlist')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Visualização')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Visualização')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-checkin')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Visualização')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-pdv')?.id },

      { id: uuidv4(), role_id: roles.find(role => role.name === 'Financeiro')?.id, permission_id: permissions.find(permission => permission.name === 'view-events')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Financeiro')?.id, permission_id: permissions.find(permission => permission.name === 'view-sales-reports')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Financeiro')?.id, permission_id: permissions.find(permission => permission.name === 'view-checkin-reports')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Financeiro')?.id, permission_id: permissions.find(permission => permission.name === 'view-tickets-reports')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Financeiro')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-general-reports')?.id },


      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'view-events')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'delete-events')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'export-events')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-tickets')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-coupons')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-collaborators')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-guestlist')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-checkin')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-orders-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-tickets')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-coupons')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-collaborators')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-guestlist')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-orders-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'do-events-checkin')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'undo-events-checkin')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'resend-events-tickets-from-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'print-events-tickets-from-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'cancel-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-tickets')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-coupons')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-collaborators')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-guestlist')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-orders-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'delete-events-tickets')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'delete-events-coupons')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'delete-events-collaborators')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'delete-events-guestlist')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'delete-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'delete-events-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Analista')?.id, permission_id: permissions.find(permission => permission.name === 'delete-events-orders-pdv')?.id },

      { id: uuidv4(), role_id: roles.find(role => role.name === 'Operador')?.id, permission_id: permissions.find(permission => permission.name === 'view-events')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Operador')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Operador')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-orders')?.id },

      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'view-producer-page')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'edit-producer-page')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'view-events')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-tickets')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-coupons')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-collaborators')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-guestlist')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-checkin')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'view-events-orders-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-tickets')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-coupons')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-collaborators')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-guestlist')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'add-events-orders-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'do-events-checkin')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'undo-events-checkin')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'resend-events-tickets-from-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'print-events-tickets-from-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'cancel-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-tickets')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-coupons')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-collaborators')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-guestlist')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'edit-events-orders-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'delete-events-tickets')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'delete-events-coupons')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'delete-events-collaborators')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'delete-events-guestlist')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'delete-events-orders')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'delete-events-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'delete-events-orders-pdv')?.id },
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Produtor')?.id, permission_id: permissions.find(permission => permission.name === 'export-events')?.id },

      // Cliente nasce podendo criar eventos. Posteriormente ele pode ver eventos que é produtor até ser aceito de fato como role Produtor
      { id: uuidv4(), role_id: roles.find(role => role.name === 'Cliente')?.id, permission_id: permissions.find(permission => permission.name === 'create-events')?.id },

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
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
      {
        id: uuidv4(),
        first_name: 'System',
        last_name: 'Administrator',
        email: 'admin@gmail.com',
        person_type: 'PJ',
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
      {
        id: uuidv4(),
        first_name: 'Cliente',
        last_name: 'Final',
        email: 'cliente@gmail.com',
        person_type: 'PJ',
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
    ]);

    console.log('People created');

    // Users
    await User.createMany([
      {
        id: uuidv4(),
        people_id: people[0].id,
        email: 'produtor@gmail.com',
        alias: 'jean-promotor',
        password: '123456',
        role_id: roles.find(role => role.name === 'Produtor')?.id,
      },
      {
        id: uuidv4(),
        people_id: people[1].id,
        email: 'admin@gmail.com',
        alias: 'system-administrator',
        password: '123456',
        role_id: roles.find(role => role.name === 'Admin')?.id,
      },
      {
        id: uuidv4(),
        people_id: people[2].id,
        email: 'cliente@gmail.com',
        alias: 'cliente-final',
        password: '123456',
        role_id: roles.find(role => role.name === 'Cliente')?.id,
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
    await City.createMany([
      { id: uuidv4(), name: 'Itajaí', state_id: states[0].id },
      { id: uuidv4(), name: 'São Paulo', state_id: states[1].id },
    ]);

    console.log('Cities created');

    // Categories
    await Category.createMany([
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
    await Status.createMany([
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
        name: 'Em Análise',
        description: 'Evento publicado pelo promoter, mas aguardando aprovaçnao da Equipe Meu Ingresso)',
        module: 'event',
      },
      {
        id: uuidv4(),
        name: 'Aguardando',
        description: 'Evento aguardando envio dos documentos do promoter',
        module: 'event',
      },
      { id: uuidv4(), name: 'Aprovado', description: 'Pagamento Aprovado', module: 'payment' },
      { id: uuidv4(), name: 'Pendente', description: 'Pagamento Pendente', module: 'payment' },
      { id: uuidv4(), name: 'Cancelado', description: 'Pagamento Cancelado', module: 'payment' },
      { id: uuidv4(), name: 'Estornado', description: 'Pagamento Estornado', module: 'payment' },
      { id: uuidv4(), name: 'Disponível', description: 'Disponível para check-in', module: 'customer_ticket' },
      { id: uuidv4(), name: 'Cancelado', description: 'Cancelado', module: 'customer_ticket' },
      {
        id: uuidv4(),
        name: 'Validado',
        description: 'Indisponível para uso; Ingresso já validado na portaria',
        module: 'customer_ticket',
      },
      { id: uuidv4(), name: 'Disponível', description: 'Cupom Disponível para uso', module: 'coupon' },
      { id: uuidv4(), name: 'Esgotado', description: 'Cupom Indisponível para uso', module: 'coupon' },
      { id: uuidv4(), name: 'Enviada', description: 'Notificação enviada', module: 'notification' },
      { id: uuidv4(), name: 'Lida', description: 'Notificação lida', module: 'notification' },
      { id: uuidv4(), name: 'Disponível', description: 'PDV Disponível para uso', module: 'pdv' },
      { id: uuidv4(), name: 'Fechado', description: 'PDV Fechado', module: 'pdv' },
    ]);

    // Se status "Reprovado" não existir, cria
    const status = await Status.query().where('name', 'Reprovado').where('module', 'event').whereNull('deleted_at').first();
    if (!status) {
      await Status.create({
        id: uuidv4(),
        name: 'Reprovado',
        module: 'event',
        description: 'Evento reprovado pela equipe Meu Ingresso',
        deleted_at: null,
      });
    }

    console.log('Statuses created');

    // Ratings
    await Rating.createMany([
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

    // Parameters
    await Parameter.createMany([
      { id: uuidv4(), key: 'site_name', value: 'Meu Ingresso', description: 'Name of the platform' },
      { id: uuidv4(), key: 'support_email', value: 'suporte@meuingresso.com.br', description: 'Support contact email' },
    ]);

    console.log('Parameters created');
  }
}
