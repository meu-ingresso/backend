import nodemailer from 'nodemailer';

export default class SendMailService {
  private host = 'smtp.gmail.com';
  private port = 465;
  private user = 'nao-responda@meuingresso.com.br';
  private pass = 'rkoduvctmcbvmzhk';

  public async sendMail() {
    const transporter = nodemailer.createTransport({
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

    const mailOptions = {
      from: this.user,
      to: 'kelvynkrug@gmail.com',
      subject: `Teste de Email`,
      html: `
        <!DOCTYPE html>
          <html lang="pt-BR">

          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>

          <body>
              <h1>Olá, Kelvyn!</h1>
              <p>Este é um teste de envio de email.</p>
              <br /><br />
              <p>Atenciosamente,</p>
              <p>Equipe MeuIngresso</p>
          </body>
          </html>
      `,
    };

    return await transporter.sendMail(mailOptions);
  }
}
