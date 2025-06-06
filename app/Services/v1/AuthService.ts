import LoginRequest from 'App/Models/Transfer/LoginRequest';
import { GoogleLoginRequest, AuthProvider } from 'App/Models/Transfer/LoginRequest';
import User from 'App/Models/Access/Users';
import People from 'App/Models/Access/People';
import UserAttachments from 'App/Models/Access/UserAttachments';
import ApiTokens from 'App/Models/Access/Tokens';
import Hash from '@ioc:Adonis/Core/Hash';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

export default class AuthService {
  public async login(payload: LoginRequest): Promise<User | null> {
    const user = await User.query().where('email', payload.email).preload('role').preload('people').first();

    if (!user || user.deleted_at || !(await Hash.verify(user.password || '', payload.password))) {
      return null;
    }

    return user;
  }

  public async googleLogin(payload: GoogleLoginRequest): Promise<User | null> {
    // Primeiro tenta encontrar usuário pelo google_id
    let user = await User.query()
      .where('google_id', payload.google_id)
      .whereNull('deleted_at')
      .preload('role')
      .preload('people')
      .preload('attachments')
      .first();

    if (user) {
      // Atualiza o avatar se mudou
      await this.updateUserAvatar(user.id, payload.picture);
      // Recarrega attachments após atualização
      await user.load('attachments');
      return user;
    }

    // Se não encontrou pelo google_id, procura pelo email
    user = await User.query()
      .where('email', payload.email)
      .whereNull('deleted_at')
      .preload('role')
      .preload('people')
      .preload('attachments')
      .first();

    if (user) {
      // Se encontrou usuário com o email, atualiza com dados do Google
      user.google_id = payload.google_id;
      user.provider = AuthProvider.GOOGLE;
      user.account_verified = payload.email_verified;
      await user.save();
      
      // Salva/atualiza o avatar
      await this.updateUserAvatar(user.id, payload.picture);
      
      // Recarrega os relacionamentos
      await user.load('role');
      await user.load('people');
      await user.load('attachments');
      
      return user;
    }

    // Se não encontrou, cria novo usuário
    return await this.createUserFromGoogle(payload);
  }

  private async createUserFromGoogle(payload: GoogleLoginRequest): Promise<User> {
    // Busca a role de "Cliente Final" (index 6 no seeder)
    const defaultRole = await this.getDefaultClientRole();
    
    // Cria primeiro o registro em People
    const people = await People.create({
      id: uuidv4(),
      first_name: payload.given_name,
      last_name: payload.family_name,
      email: payload.email,
      person_type: 'PF',
    });

    // Gera um alias único baseado no nome
    const alias = await this.generateUniqueAlias(payload.given_name, payload.family_name);

    // Cria o usuário
    const user = await User.create({
      id: uuidv4(),
      people_id: people.id,
      email: payload.email,
      alias: alias,
      password: '', // Usuários sociais não precisam de senha
      role_id: defaultRole?.id || null,
      account_verified: payload.email_verified,
      google_id: payload.google_id,
      provider: AuthProvider.GOOGLE,
    });

    // Salva o avatar como attachment
    await this.saveUserAvatar(user.id, payload.picture);

    // Carrega os relacionamentos
    await user.load('role');
    await user.load('people');
    await user.load('attachments');

    return user;
  }

  private async saveUserAvatar(userId: string, avatarUrl: string): Promise<void> {
    await UserAttachments.create({
      id: uuidv4(),
      user_id: userId,
      name: 'avatar',
      type: 'social_avatar',
      value: avatarUrl,
    });
  }

  private async updateUserAvatar(userId: string, avatarUrl: string): Promise<void> {
    // Busca attachment existente de avatar
    const existingAvatar = await UserAttachments.query()
      .where('user_id', userId)
      .where('name', 'avatar')
      .where('type', 'social_avatar')
      .whereNull('deleted_at')
      .first();

    if (existingAvatar) {
      // Atualiza se a URL mudou
      if (existingAvatar.value !== avatarUrl) {
        existingAvatar.value = avatarUrl;
        await existingAvatar.save();
      }
    } else {
      // Cria novo attachment se não existe
      await this.saveUserAvatar(userId, avatarUrl);
    }
  }

  private async getDefaultClientRole() {
    // Busca a role "Cliente Final"
    const Role = (await import('App/Models/Access/Roles')).default;
    return await Role.query().where('name', 'Cliente Final').first();
  }

  private async generateUniqueAlias(firstName: string, lastName: string): Promise<string> {
    let baseAlias = `${firstName}-${lastName}`.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9-]/g, '') // Remove caracteres especiais
      .replace(/-+/g, '-'); // Remove hífens duplicados

    let alias = baseAlias;
    let counter = 1;

    // Verifica se o alias já existe e gera um único
    while (await User.query().where('alias', alias).first()) {
      alias = `${baseAlias}-${counter}`;
      counter++;
    }

    return alias;
  }

  public async removeExpiredTokens(userId: string): Promise<void> {
    const now = DateTime.now().toISO();

    await ApiTokens.query().where('user_id', userId).andWhere('expires_at', '<', now).delete();
  }

  public async deleteAllTokens(userId: string): Promise<void> {
    await ApiTokens.query().where('user_id', userId).delete();
  }

  public static getUserAvatar(user: User): string | null {
    const avatar = user.attachments?.find(
      (attachment) => 
        attachment.name === 'avatar' && 
        attachment.type === 'social_avatar' && 
        !attachment.deleted_at
    );
    
    return avatar?.value || null;
  }

  // Método helper para verificar se é usuário social
  public static isSocialUser(user: User): boolean {
    return user.provider !== AuthProvider.DEFAULT;
  }

  // Método helper para verificar se usuário pode alterar senha
  public static canChangePassword(user: User): boolean {
    return user.provider === AuthProvider.DEFAULT;
  }
}
