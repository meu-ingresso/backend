import nodemailer from 'nodemailer';
import Env from '@ioc:Adonis/Core/Env';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export default class SendMailService {
  private host = 'smtp.gmail.com';
  private port = 465;
  private user = 'nao-responda@meuingresso.com.br';
  private pass = 'rkoduvctmcbvmzhk';

  private transporter = nodemailer.createTransport({
    host: this.host,
    port: this.port,
    auth: {
      user: this.user,
      pass: this.pass,
    },
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
  });

  public async sendMail(options: MailOptions) {
    const mailOptions = {
      from: this.user,
      ...options,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  private getEmailStyles(): string {
    return `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: #fafafa;
        color: #333;
        line-height: 1.6;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 672px;
        margin: 0 auto;
        background-color: #fafafa;
      }
      .header { 
        background-color: #ffffff;
        padding: 24px;
        text-align: center;
      }
      .content { 
        padding: 32px;
        text-align: center;
        padding-top: 44px;
        padding-bottom: 0;
      }
      h1 {
        font-size: 24px;
        line-height: 32px;
        margin-bottom: 8px;
        font-weight: 700;
        color: rgb(31, 41, 55);
      }
      .subtitle {
        color: rgb(75, 85, 99);
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 32px;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background-color: rgba(103, 48, 168, 0.1);
        color: rgb(103, 48, 168);
        padding: 8px 16px;
        border-radius: 9999px;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 24px;
      }
      .button {
        display: inline-block;
        background-color: rgb(103, 48, 168);
        color: white !important;
        padding: 12px 32px;
        text-decoration: none !important;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 700;
        margin: 32px 0;
        transition: background-color 0.3s;
      }
      .button:hover {
        background-color: rgba(103, 48, 168, 0.9);
      }
      .button svg {
        vertical-align: middle;
        fill: white;
      }
      .info-box {
        background-color: rgb(239, 246, 255);
        border: 1px solid rgb(191, 219, 254);
        border-radius: 8px;
        padding: 16px;
        margin: 32px 0;
        text-align: left;
      }
      .info-box h4 {
        color: rgb(30, 64, 175);
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      .info-box ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .info-box li {
        color: rgb(29, 78, 216);
        font-size: 14px;
        line-height: 20px;
        margin: 4px 0;
        padding-left: 16px;
        position: relative;
      }
      .info-box li:before {
        content: "•";
        position: absolute;
        left: 0;
      }
      .footer {
        background-color: rgb(243, 244, 246);
        padding: 24px;
        text-align: center;
        font-size: 14px;
        color: rgb(107, 114, 128);
      }
      .social-links {
        text-align: center;
        margin-bottom: 16px;
      }
      .social-links a {
        display: inline-block;
        margin: 0 8px;
        text-decoration: none;
      }
      .social-links img {
        display: block;
      }
      .footer-text {
        margin-bottom: 8px;
      }
      .help-text {
        margin-bottom: 16px;
      }
      .help-link {
        color: rgb(107, 114, 128);
        text-decoration: none;
        font-weight: 700;
      }
      .footer-divider {
        height: 1px;
        background-color: rgb(229, 231, 235);
        margin: 16px 0;
      }
      .copyright {
        font-size: 12px;
        line-height: 16px;
        color: rgb(156, 163, 175);
      }
    `;
  }

  private getEmailHeader(): string {
    // Usando URL do logo diretamente
    // const logoSrc =
    //   'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/meuingresso-logotipo%40variacoes-09-3Vhqiv5UJ0DX7NLGmwVrn4VJ8dgPPC.png';
    const logoSrc = 'https://meuingresso-attachments.s3.us-east-1.amazonaws.com/logo_web.png';

    return `<img src="${logoSrc}" alt="MeuIngresso" style="height: 44px; width: auto;">`;
  }

  private getEmailFooter(): string {
    return `
      <div class="social-links">
        <a href="https://www.tiktok.com/@meuingresso" target="_blank">
          <img src="https://img.icons8.com/ios-glyphs/30/9ca3af/tiktok.png" alt="TikTok" width="20" height="20">
        </a>
        <a href="https://www.instagram.com/meuingressodigital/" target="_blank">
          <img src="https://img.icons8.com/ios-glyphs/30/9ca3af/instagram-new.png" alt="Instagram" width="20" height="20">
        </a>
        <a href="https://www.linkedin.com/company/meuingresso/" target="_blank">
          <img src="https://img.icons8.com/ios-glyphs/30/9ca3af/linkedin.png" alt="LinkedIn" width="20" height="20">
        </a>
        <a href="https://www.facebook.com/meuingressodigital" target="_blank">
          <img src="https://img.icons8.com/ios-glyphs/30/9ca3af/facebook-new.png" alt="Facebook" width="20" height="20">
        </a>
        <a href="https://www.youtube.com/@canalmi" target="_blank">
          <img src="https://img.icons8.com/ios-glyphs/30/9ca3af/youtube-play.png" alt="YouTube" width="20" height="20">
        </a>
      </div>
      
      <p class="footer-text">Obrigado por escolher a Meu Ingresso para a sua experiência!</p>
      
      <p class="help-text">
        Precisa de ajuda? Acesse nossa <a href="https://ajuda.meuingresso.com.br/" target="_blank" class="help-link">Central de Ajuda</a>
      </p>
      
      <div class="footer-divider"></div>
      
      <div class="copyright">
        Meu Ingresso © 2025 - Todos os direitos reservados<br>
        Este é um e-mail automático, não responda a esta mensagem.
      </div>
    `;
  }

  private buildEmailTemplate(content: string): string {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${this.getEmailStyles()}</style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  ${this.getEmailHeader()}
              </div>
              <div class="content">
                  ${content}
              </div>
              <div class="footer">
                  ${this.getEmailFooter()}
              </div>
          </div>
      </body>
      </html>
    `;
  }

  public async sendVerificationEmail(email: string, userName: string, token: string) {
    const verificationUrl = `${Env.get(
      'FRONTEND_URL',
      'http://localhost:3000'
    )}/verify-email?email=${encodeURIComponent(email)}&code=${token}`;

    const content = `
      <div class="badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <path d="m9 11 3 3L22 4"></path>
        </svg>
        Verificação de email
      </div>
      
      <h1>Olá, ${userName.split(' ')[0]}!</h1>
      
      <p class="subtitle">
        Seja bem-vindo ao Meu Ingresso! Para começar a usar sua conta,<br>
        precisamos verificar seu endereço de email.
      </p>
      
      <a href="${verificationUrl}" class="button">Verificar email</a>
      
      <div class="info-box">
        <h4>Importante:</h4>
        <ul>
          <li>Este link expira em 15 minutos</li>
          <li>Após verificar, você poderá acessar todos os recursos</li>
        </ul>
      </div>
    `;

    const html = this.buildEmailTemplate(content);

    return await this.sendMail({
      to: email,
      subject: 'Meu Ingresso - Verificação de Email',
      html,
    });
  }

  public async sendPasswordResetEmail(email: string, userName: string, token: string) {
    const resetUrl = `${Env.get(
      'FRONTEND_URL',
      'http://localhost:3000'
    )}/reset-password?code=${token}&email=${encodeURIComponent(email)}`;

    const content = `
      <div class="badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12.5 10.5L8 15l4.5 4.5m0-9L17 15l-4.5 4.5"></path>
          <path d="M12 2v6"></path>
          <rect width="16" height="16" x="4" y="6" rx="2"></rect>
        </svg>
        Redefinição de senha
      </div>
      
      <h1>Olá, ${userName.split(' ')[0]}!</h1>
      
      <p class="subtitle">
        Problemas com a sua senha? Não se preocupe. Clique no link abaixo e<br>
        crie uma nova senha para sua conta.
      </p>
      
      <a href="${resetUrl}" class="button">🔗 Nova senha</a>
      
      <div class="info-box">
        <h4>Importante:</h4>
        <ul>
          <li>Este código expira em 15 minutos</li>
          <li>Crie uma senha com caracteres, números e letras para melhor segurança</li>
          <li>Não compartilhe sua senha com terceiros</li>
          <li>Se não solicitou a recuperação/troca da senha, ignore este e-mail</li>
        </ul>
      </div>
    `;

    const html = this.buildEmailTemplate(content);

    return await this.sendMail({
      to: email,
      subject: 'Recuperação de Senha - MeuIngresso',
      html,
    });
  }

  public async sendPasswordChangedEmail(email: string, userName: string) {
    const content = `
      <div class="badge" style="background-color: rgba(34, 197, 94, 0.1); color: rgb(34, 197, 94);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <path d="m9 11 3 3L22 4"></path>
        </svg>
        Senha alterada
      </div>
      
      <h1>Tudo certo, ${userName.split(' ')[0]}!</h1>
      
      <p class="subtitle">
        Sua senha foi alterada com sucesso.<br>
        Agora você já pode acessar sua conta com a nova senha.
      </p>
      
      <div class="info-box">
        <h4>Importante:</h4>
        <ul>
          <li>Lembre-se de usar sua nova senha no próximo login</li>
          <li>Se você não realizou esta alteração, entre em contato conosco imediatamente</li>
        </ul>
      </div>
    `;

    const html = this.buildEmailTemplate(content);

    return await this.sendMail({
      to: email,
      subject: 'Senha Alterada com Sucesso - MeuIngresso',
      html,
    });
  }

  public async sendAccountCreatedEmail(email: string, userName: string) {
    const loginUrl = `${Env.get('FRONTEND_URL', 'http://localhost:3000')}/login`;

    const content = `
      <div class="badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <path d="m9 11 3 3L22 4"></path>
        </svg>
        Sua conta foi criada!
      </div>
      
      <h1>Olá, ${userName.split(' ')[0]}!</h1>
      
      <p class="subtitle">
        Agora você pode descobrir e comprar ingressos para as melhores<br>
        experiências, além de publicar seus próprios eventos!
      </p>
      
      <a href="${loginUrl}" class="button">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 8px; vertical-align: middle;">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47z"/>
        </svg>
        Minha conta
      </a>
      
      <div class="info-box">
        <h4>Dicas para começar:</h4>
        <ul>
          <li>Complete seu perfil para uma agilizar suas compras</li>
          <li>Explore a seção de eventos e use o filtro para encontrar as melhores experiências</li>
        </ul>
      </div>
    `;

    const html = this.buildEmailTemplate(content);

    return await this.sendMail({
      to: email,
      subject: 'Bem-vindo ao Meu Ingresso!',
      html,
    });
  }
}
