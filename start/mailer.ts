import { MailerConfig } from 'nodemailer';

const mailConfig: MailerConfig = {
  mailer: 'smtp',

  smtp: {
    host: 'smtp.gmail.com', // host do email
    port: 465,
    secure: false,
    auth: {
      user: 'email',
      pass: 'senha',
    },
  },
};

export default mailConfig;
