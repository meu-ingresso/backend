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
        name: 'Visualização',
        description: 'Pode visualizar o painel de controle do evento, mas não pode editar as informações',
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
      {
        id: uuidv4(),
        name: 'Cliente Final',
        description: 'Pode apenas visualizar o evento e comprar ingressos',
        created_at: DateTime.now().setZone('America/Sao_Paulo'),
        updated_at: DateTime.now().setZone('America/Sao_Paulo'),
      },
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
      { id: uuidv4(), name: 'Reprovado', description: 'Evento reprovado pela equipe Meu Ingresso', module: 'event' },
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
