import nodemailer from 'nodemailer';
import utils from 'Utils/utils';

export default class SendMailService {
  public async sendMail(payload: any) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'no-reply@accesslogistics.com.br',
        pass: '03od8Hb)$q4M',
      },
    });

    const mailOptions = {
      from: 'no-reply@accesslogistics.com.br',
      to: 'nps@accesslogistics.com.br',
      subject: `Nova resposta do NPS | ${payload.name}`,
      html: `
        <!DOCTYPE html>
          <html lang="pt-BR">

          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333;
                  }

                  .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }

                  .logo {
                    text-align: center;
                    padding: 20px;
                    background-color: #023f88;
                  }

                  .logo img {
                    max-width: 200px;
                    height: auto;
                  }

                  .header-img {
                    width: 50%;
                    height: auto;
                  }

                  .header h1 {
                    margin: 0;
                    font-size: 24px;
                  }

                  .content {
                    padding: 20px;
                  }

                  .content p, .content span {
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0 0 20px;
                  }

                  .bold {
                    font-weight: bold;
                  }

                  .content a {
                    display: inline-block;
                    background-color: #ed1b34;
                    color: #ffffff;
                    padding: 15px 25px;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 18px;
                    transition: background-color 0.3s ease;
                  }

                  .content a:hover {
                    background-color: #c1182c;
                  }


                  ul {
                    padding-left: 20px; /* ou outro valor de padding que desejar */
                  }

                  li {
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    line-height: 1.5;
                    color: #333;
                  }
              </style>
          </head>

          <body>
              <div class="container">
                  <div>
                      <img src="https://access-attachments.s3.us-east-2.amazonaws.com/avatar.png" alt="Imagem de Cabeçalho" class="header-img">
                  </div>
                  <div class="content">
                      <p>Olá! Uma nova resposta foi registrada no NPS.</p>
                      <span class="bold">
                        Nome:
                      </span>
                      <span> ${payload.name} </span> <br/>

                      <span class="bold">
                        CNPJ:
                      </span>
                      <span> ${payload.tax} </span> <br/>

                      <span class="bold">
                        NPS:
                      </span>
                      <span> ${payload.recommendation} </span> <br/>

                      <span class="bold">
                        CSAT:
                      </span>
                      <span> ${payload.satisfaction} </span> <br/>

                      <span class="bold">
                        Informações Adicionais:
                      </span>
                      <span> ${payload.additional_information ? payload.additional_information : '-'} </span> <br/><br/>

                      <br/><br/>
                      <p>Atenciosamente,<br/> Íris<br/>Assistente Virtual</p>
                  </div>
              </div>
          </body>

          </html>
      `,
    };

    return await transporter.sendMail(mailOptions);
  }

  public async sendNpsMail(data: any) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'no-reply@accesslogistics.com.br',
        pass: '03od8Hb)$q4M',
      },
      tls: {
        ciphers: 'TLSv1.2',
      },
    });

    const processes = data.processes
      .map(
        (process) =>
          `<tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${process.process_number}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${
          process.external_reference ? process.external_reference : '-'
        }</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${process.origem ? process.origem : '-'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${process.destino ? process.destino : '-'}</td>
      </tr>`
      )
      .join('');

    const mailOptions = {
      from: 'no-reply@accesslogistics.com.br',
      to: data.email,
      // to: 'kelvynkrug@gmail.com',
      subject: 'NPS - ACCESS GLOBAL',
      html: `
        <!DOCTYPE html>
          <html lang="pt-BR">

          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333;
                  }
                  .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  .header-img {
                    width: 100%;
                    height: auto;
                  }
                  .content {
                    padding: 20px;
                  }
                  .content p {
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0 0 20px;
                  }
                  .table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                  }
                  .table th, .table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                  }
                  .table th {
                    background-color: #f2f2f2;
                  }
                  .footer {
                    background-color: #f4f4f4;
                    padding: 10px;
                    text-align: center;
                    font-size: 12px;
                    color: #888888;
                  }
              </style>
          </head>

          <body>
              <div class="container">
                  <div>
                      <img src="https://access-attachments.s3.us-east-2.amazonaws.com/capa.png" alt="Imagem de Cabeçalho" class="header-img">
                  </div>
                  <div class="content">
                      <p>
                        Olá! Sua opinião é extremamente valiosa para nós! Para que possamos continuar aprimorando nossos serviços e proporcionar a melhor experiência possível, gostaríamos de saber sua opinião sobre os processos em que a ${data.company_name} esteve envolvida:
                      </p>
                      <p>
                        Abaixo, listamos os últimos ${data.processes.length} processos para sua referência. A sua resposta será única e representará um compilado de todos os processos finalizados no mês.
                      </p>
                      <table class="table">
                        <thead>
                          <tr>
                            <th>Processo</th>
                            <th>Referência Externa</th>
                            <th>Origem</th>
                            <th>Destino</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${processes}
                        </tbody>
                      </table>
                      <p>
                        Responda a nossa pesquisa rápida de NPS e nos ajude a entender como podemos servir você ainda melhor.
                      </p>
                      <p>
                        <br/> <a href="https://nps.accesslogistics.com.br/" target="_blank">Clique aqui para participar da pesquisa</a>
                      </p>
                      <br/>
                      <p>
                          Agradecemos desde já por sua colaboração!
                      </p>
                      <br/>
                      <p>Atenciosamente,<br/><br/> Access Global</p>
                  </div>
                  <div class="footer">
                      <p>
                          Você está recebendo este e-mail porque é um cliente valioso para nós e queremos ouvir sua opinião.
                      </p>
                  </div>
              </div>
          </body>

          </html>
      `,
    };

    return await transporter.sendMail(mailOptions);
  }

  public async sendAutomationInit(process_name: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'no-reply@accesslogistics.com.br',
        pass: '03od8Hb)$q4M',
      },
    });

    const mailOptions = {
      from: 'no-reply@accesslogistics.com.br',
      to: 'k.krug@accesslogistics.com.br,c.civa@accesslogistics.com.br,a.feliciano@accesslogistics.com.br',
      subject: `Processo Iniciado | ${process_name}`,
      html: `
        <!DOCTYPE html>
          <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                      color: #333;
                  }

                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }

                  .logo {
                      text-align: center;
                      padding: 20px;
                      background-color: #023f88;
                  }

                  .logo img {
                      max-width: 200px;
                      height: auto;
                  }

                  .image-container {
                      display: flex; /* Utiliza Flexbox */
                      justify-content: center; /* Centraliza horizontalmente */
                      align-items: center; /* Centraliza verticalmente, se necessário */
                      padding: 20px; /* Opcional: adiciona espaçamento ao redor da imagem */
                  }

                  .header-img {
                      max-width: 100%; /* Garante que a imagem não ultrapasse o contêiner */
                      height: auto;
                  }

                  .header h1 {
                      margin: 0;
                      font-size: 24px;
                  }

                  .content {
                      padding: 20px;
                  }

                  .content p, .content span {
                      font-size: 14px;
                      line-height: 1.5;
                      margin: 0 0 20px;
                  }

                  .bold {
                      font-weight: bold;
                  }

                  .content a {
                      display: inline-block;
                      background-color: #ed1b34;
                      color: #ffffff;
                      padding: 15px 25px;
                      text-align: center;
                      text-decoration: none;
                      border-radius: 5px;
                      font-size: 18px;
                      transition: background-color 0.3s ease;
                  }

                  .content a:hover {
                      background-color: #c1182c;
                  }

                  ul {
                      padding-left: 20px; /* ou outro valor de padding que desejar */
                  }

                  li {
                      font-family: Arial, sans-serif;
                      font-size: 14px;
                      line-height: 1.5;
                      color: #333;
                  }
              </style>
            </head>
          <body>
              <div class="container">
                  <div class="image-container">
                      <img src="https://access-attachments.s3.us-east-2.amazonaws.com/avatar.png" alt="Imagem de Cabeçalho" class="header-img">
                  </div>
                  <div class="content">
                      <span class="bold">
                          Olá! O processo de ${process_name} foi iniciado.
                      </span>

                      <br/><br/>
                      <p>Atenciosamente,<br/><br/> Íris<br/>Assistente Virtual</p>
                  </div>
              </div>
          </body>
        </html>
      `,
    };

    return await transporter.sendMail(mailOptions);
  }

  public async sendAutomationError(payload: any) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'no-reply@accesslogistics.com.br',
        pass: '03od8Hb)$q4M',
      },
    });

    const mailOptions = {
      from: 'no-reply@accesslogistics.com.br',
      to: 'k.krug@accesslogistics.com.br,c.civa@accesslogistics.com.br,a.feliciano@accesslogistics.com.br',
      subject: `Erro no Processo | ${payload.process_name}`,
      html: `
        <!DOCTYPE html>
          <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                      color: #333;
                  }

                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }

                  .logo {
                      text-align: center;
                      padding: 20px;
                      background-color: #023f88;
                  }

                  .logo img {
                      max-width: 200px;
                      height: auto;
                  }

                  .image-container {
                      display: flex; /* Utiliza Flexbox */
                      justify-content: center; /* Centraliza horizontalmente */
                      align-items: center; /* Centraliza verticalmente, se necessário */
                      padding: 20px; /* Opcional: adiciona espaçamento ao redor da imagem */
                  }

                  .header-img {
                      max-width: 100%; /* Garante que a imagem não ultrapasse o contêiner */
                      height: auto;
                  }

                  .header h1 {
                      margin: 0;
                      font-size: 24px;
                  }

                  .content {
                      padding: 20px;
                  }

                  .content p, .content span {
                      font-size: 14px;
                      line-height: 1.5;
                      margin: 0 0 20px;
                  }

                  .bold {
                      font-weight: bold;
                  }

                  .content a {
                      display: inline-block;
                      background-color: #ed1b34;
                      color: #ffffff;
                      padding: 15px 25px;
                      text-align: center;
                      text-decoration: none;
                      border-radius: 5px;
                      font-size: 18px;
                      transition: background-color 0.3s ease;
                  }

                  .content a:hover {
                      background-color: #c1182c;
                  }

                  ul {
                      padding-left: 20px; /* ou outro valor de padding que desejar */
                  }

                  li {
                      font-family: Arial, sans-serif;
                      font-size: 14px;
                      line-height: 1.5;
                      color: #333;
                  }
              </style>
            </head>
          <body>
              <div class="container">
                  <div class="image-container">
                      <img src="https://access-attachments.s3.us-east-2.amazonaws.com/avatar.png" alt="Imagem de Cabeçalho" class="header-img">
                  </div>
                  <div class="content">
                      <span class="bold">
                          Olá! Ocorreu um erro ao realizar o processo de ${payload.process_name}.
                      </span>

                      <p>
                      ${payload.error}
                      </p>

                      <br/><br/>
                      <p>Atenciosamente,<br/><br/> Íris<br/>Assistente Virtual</p>
                  </div>
              </div>
          </body>
        </html>
      `,
    };

    return await transporter.sendMail(mailOptions);
  }

  public async sendAutomationResult(payload: any) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'no-reply@accesslogistics.com.br',
        pass: '03od8Hb)$q4M',
      },
    });

    const mailOptions = {
      from: 'no-reply@accesslogistics.com.br',
      to: 'k.krug@accesslogistics.com.br,c.civa@accesslogistics.com.br,a.feliciano@accesslogistics.com.br',
      subject: `Processo Finalizado | ${payload.process_name}`,
      html: `
        <!DOCTYPE html>
          <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                      color: #333;
                  }

                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }

                  .logo {
                      text-align: center;
                      padding: 20px;
                      background-color: #023f88;
                  }

                  .logo img {
                      max-width: 200px;
                      height: auto;
                  }

                  .image-container {
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      padding: 20px;
                  }

                  .header-img {
                      max-width: 100%;
                      height: auto;
                  }

                  .header h1 {
                      margin: 0;
                      font-size: 24px;
                  }

                  .content {
                      padding: 20px;
                  }

                  .content p, .content span {
                      font-size: 14px;
                      line-height: 1.5;
                      margin: 0 0 20px;
                  }

                  .bold {
                      font-weight: bold;
                  }

                  .content a {
                      display: inline-block;
                      background-color: #ed1b34;
                      color: #ffffff;
                      padding: 15px 25px;
                      text-align: center;
                      text-decoration: none;
                      border-radius: 5px;
                      font-size: 18px;
                      transition: background-color 0.3s ease;
                  }

                  .content a:hover {
                      background-color: #c1182c;
                  }

                  ul {
                      padding-left: 20px;
                  }

                  li {
                      font-family: Arial, sans-serif;
                      font-size: 14px;
                      line-height: 1.5;
                      color: #333;
                  }
              </style>
            </head>
          <body>
              <div class="container">
                  <div class="image-container">
                      <img src="https://access-attachments.s3.us-east-2.amazonaws.com/avatar.png" alt="Imagem de Cabeçalho" class="header-img">
                  </div>
                  <div class="content">
                      <span>
                          Olá! O processo de ${payload.process_name} foi finalizado.
                      </span>
                      <br /><br />

                      <span class="bold">
                          Propostas não aprovadas:
                      </span>
                      <span> ${payload.unapprovedProposals} </span> <br/>

                      <span class="bold">
                          Ofertas não aprovadas:
                      </span>
                      <span> ${payload.unapprovedOffers} </span> <br/>

                      <span class="bold">
                          Clientes sem responsável:
                      </span>
                      <span> ${payload.responsiblePersons} </span> <br/>


                      <br/><br/>
                      <p>Atenciosamente,<br/> Íris<br/>Assistente Virtual</p>
                  </div>
              </div>
          </body>
        </html>
      `,
    };

    return await transporter.sendMail(mailOptions);
  }

  public async sendAutomationFinancial(payload: any) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'no-reply@accesslogistics.com.br',
        pass: '03od8Hb)$q4M',
      },
    });

    const mailOptions = {
      from: 'no-reply@accesslogistics.com.br',
      to: 'p.monteiro@accesslogistics.com.br',
      cc: 'j.metzler@accesslogistics.com.br,g.martendal@accesslogistics.com.br,e.araujo@accesslogistics.com.br',
      bcc: 'k.krug@accesslogistics.com.br,c.civa@accesslogistics.com.br',
      subject: `Faturas em Atraso`,
      html: `
        <!DOCTYPE html>
          <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                      color: #333;
                  }

                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }

                  .logo {
                      text-align: center;
                      padding: 20px;
                      background-color: #023f88;
                  }

                  .logo img {
                      max-width: 200px;
                      height: auto;
                  }

                  .image-container {
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      padding: 10px;
                  }

                  .header-img {
                      max-width: 100%;
                      height: auto;
                  }

                  .header h1 {
                      margin: 0;
                      font-size: 24px;
                  }

                  .content {
                      padding: 20px;
                  }

                  .content p, .content span {
                      font-size: 14px;
                      line-height: 1.5;
                      margin: 0 0 20px;
                  }

                  .bold {
                      font-weight: bold;
                  }

                  .content a {
                      display: inline-block;
                      background-color: #ed1b34;
                      color: #ffffff;
                      padding: 10px 20px;
                      text-align: center;
                      text-decoration: none;
                      border-radius: 5px;
                      font-size: 18px;
                      transition: background-color 0.3s ease;
                  }

                  a {
                    color: #fff !important;
                  }

                  ul {
                      padding-left: 20px;
                  }

                  li {
                      font-family: Arial, sans-serif;
                      font-size: 14px;
                      line-height: 1.5;
                      color: #333;
                  }

                  .subTitle {
                    font-size: 16px !important;
                    font-weight: bold !important;
                  }
              </style>
            </head>
          <body>
              <div class="container">
                  <div class="image-container">
                      <img src="https://access-attachments.s3.us-east-2.amazonaws.com/avatar.png" alt="Imagem de Cabeçalho" class="header-img">
                  </div>
                  <div class="content">
                      <span>
                          Bom dia! Segue o acompanhamento das faturas de agentes com atraso, conforme o período de análise. Abaixo estão os totalizadores:
                      </span>
                      <br />


                      <br />

                      <span class="subTitle">
                          Faturas de Crédito:
                      </span> <br />

                      <span class="bold">
                          Quantidade de faturas atrasadas (USD):
                      </span>
                      <span> ${payload.result.credit.lateDollarInvoices} </span> <br/>

                      <span class="bold">
                          Valor total em atraso (USD):
                      </span>
                      <span> ${utils.formatCurrency(payload.result.credit.totalDollarInvoices, 'USD')} </span> <br/>

                      <span class="bold">
                          Quantidade de faturas atrasadas (BRL):
                      </span>
                      <span> ${payload.result.credit.lateRealInvoices} </span> <br/>

                      <span class="bold">
                          Valor total em atraso (BRL):
                      </span>
                        <span> ${utils.formatCurrency(payload.result.credit.totalRealInvoices, 'BRL')} </span> <br/>


                      <span class="bold">
                          Quantidade de faturas atrasadas (EUR):
                      </span>
                      <span> ${payload.result.credit.lateEurInvoices} </span> <br/>

                      <span class="bold">
                          Valor total em atraso (EUR):
                      </span>
                      <span> ${utils.formatCurrency(payload.result.credit.totalEurInvoices, 'EUR')} </span> <br/>


                      <span class="bold">
                          Média de dias em atraso:
                      </span>
                      <span> ${payload.result.credit.mediumDelay} </span> <br/><br/>

                      <span class="subTitle">
                          Faturas de Débito:
                      </span> <br />

                      <span class="bold">
                          Quantidade de faturas atrasadas (USD):
                      </span>
                      <span> ${payload.result.debit.lateDollarInvoices} </span> <br/>

                      <span class="bold">
                          Valor total em atraso (USD):
                      </span>
                      <span> ${utils.formatCurrency(payload.result.debit.totalDollarInvoices, 'USD')} </span> <br/>

                      <span class="bold">
                          Quantidade de faturas atrasadas (BRL):
                      </span>
                      <span> ${payload.result.debit.lateRealInvoices} </span> <br/>

                      <span class="bold">
                          Valor total em atraso (BRL):
                      </span>
                      <span> ${utils.formatCurrency(payload.result.debit.totalRealInvoices, 'BRL')} </span> <br/>


                      <span class="bold">
                          Quantidade de faturas atrasadas (EUR):
                      </span>
                      <span> ${payload.result.debit.lateEurInvoices} </span> <br/>

                      <span class="bold">
                          Valor total em atraso (EUR):
                      </span>
                      <span> ${utils.formatCurrency(payload.result.debit.totalEurInvoices, 'EUR')} </span> <br/>


                      <span class="bold">
                          Média de dias em atraso:
                      </span>
                      <span> ${payload.result.credit.mediumDelay} </span> <br/><br/><br />

                      <span>
                          Abaixo segue o link para download do relatório completo:
                      </span> <br />

                      <a href="${payload.uploadResultXLSX}" target="_blank"> Download do Relatório </a>


                      <br/><br/>
                      <span>
                          Para quaisquer dúvidas ou esclarecimentos, por favor entrem em contato com a equipe de Projetos.
                      </span>

                      <br/><br/>
                      <p>Atenciosamente,<br/> Íris<br/>Assistente Virtual</p>
                  </div>
              </div>
          </body>
        </html>
      `,
    };

    return await transporter.sendMail(mailOptions);
  }

  public async sendAutomationQualification(payload: any) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'no-reply@accesslogistics.com.br',
        pass: '03od8Hb)$q4M',
      },
    });

    const mailOptions = {
      from: 'no-reply@accesslogistics.com.br',
      to: 'k.krug@accesslogistics.com.br,c.civa@accesslogistics.com.br',
      subject: `Qualificação de Clientes`,
      html: `
        <!DOCTYPE html>
          <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                      color: #333;
                  }

                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }

                  .logo {
                      text-align: center;
                      padding: 20px;
                      background-color: #023f88;
                  }

                  .logo img {
                      max-width: 200px;
                      height: auto;
                  }

                  .image-container {
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      padding: 10px;
                  }

                  .header-img {
                      max-width: 100%;
                      height: auto;
                  }

                  .header h1 {
                      margin: 0;
                      font-size: 24px;
                  }

                  .content {
                      padding: 20px;
                  }

                  .content p, .content span {
                      font-size: 14px;
                      line-height: 1.5;
                      margin: 0 0 20px;
                  }

                  .bold {
                      font-weight: bold;
                  }

                  .content a {
                      display: inline-block;
                      background-color: #ed1b34;
                      color: #ffffff;
                      padding: 10px 20px;
                      text-align: center;
                      text-decoration: none;
                      border-radius: 5px;
                      font-size: 18px;
                      transition: background-color 0.3s ease;
                  }

                  a {
                    color: #fff !important;
                  }

                  ul {
                      padding-left: 20px;
                  }

                  li {
                      font-family: Arial, sans-serif;
                      font-size: 14px;
                      line-height: 1.5;
                      color: #333;
                  }

                  .subTitle {
                    font-size: 16px !important;
                    font-weight: bold !important;
                  }
              </style>
            </head>
          <body>
              <div class="container">
                  <div class="image-container">
                      <img src="https://access-attachments.s3.us-east-2.amazonaws.com/avatar.png" alt="Imagem de Cabeçalho" class="header-img">
                  </div>
                  <div class="content">
                      <span>
                          Boa Noite! Segue o acompanhamento das qualificações de clientes desta semana.
                      </span>
                      <br /><br />

                      <span>
                          Abaixo segue o link para download do relatório completo:
                      </span> <br /><br />

                      <a href="${payload.uploadResultCSV}" target="_blank"> Download do Relatório CSV </a> <br /><br />
                      <a href="${payload.uploadResultXLSX}" target="_blank"> Download do Relatório XLSX </a>


                      <br/><br/>
                      <span>
                          Para quaisquer dúvidas ou esclarecimentos, por favor entre em contato com a equipe de Projetos.
                      </span>

                      <br/><br/>
                      <p>Atenciosamente,<br/><br/> Íris<br/>Assistente Virtual</p>
                  </div>
              </div>
          </body>
        </html>
      `,
    };

    return await transporter.sendMail(mailOptions);
  }

  public async sendAutomationClassification(payload: any) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'no-reply@accesslogistics.com.br',
        pass: '03od8Hb)$q4M',
      },
    });

    const mailOptions = {
      from: 'no-reply@accesslogistics.com.br',
      to: 'k.krug@accesslogistics.com.br,c.civa@accesslogistics.com.br',
      subject: `Classificação de Clientes`,
      html: `
        <!DOCTYPE html>
          <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                      color: #333;
                  }

                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }

                  .logo {
                      text-align: center;
                      padding: 20px;
                      background-color: #023f88;
                  }

                  .logo img {
                      max-width: 200px;
                      height: auto;
                  }

                  .image-container {
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      padding: 10px;
                  }

                  .header-img {
                      max-width: 100%;
                      height: auto;
                  }

                  .header h1 {
                      margin: 0;
                      font-size: 24px;
                  }

                  .content {
                      padding: 20px;
                  }

                  .content p, .content span {
                      font-size: 14px;
                      line-height: 1.5;
                      margin: 0 0 20px;
                  }

                  .bold {
                      font-weight: bold;
                  }

                  .content a {
                      display: inline-block;
                      background-color: #ed1b34;
                      color: #ffffff;
                      padding: 10px 20px;
                      text-align: center;
                      text-decoration: none;
                      border-radius: 5px;
                      font-size: 18px;
                      transition: background-color 0.3s ease;
                  }

                  a {
                    color: #fff !important;
                  }

                  ul {
                      padding-left: 20px;
                  }

                  li {
                      font-family: Arial, sans-serif;
                      font-size: 14px;
                      line-height: 1.5;
                      color: #333;
                  }

                  .subTitle {
                    font-size: 16px !important;
                    font-weight: bold !important;
                  }
              </style>
            </head>
          <body>
              <div class="container">
                  <div class="image-container">
                      <img src="https://access-attachments.s3.us-east-2.amazonaws.com/avatar.png" alt="Imagem de Cabeçalho" class="header-img">
                  </div>
                  <div class="content">
                      <span>
                          Boa Noite! Segue o acompanhamento das classificações de clientes desta semana.
                      </span>
                      <br /><br />

                      <span>
                          Abaixo segue o link para download do relatório completo:
                      </span> <br /><br />

                      <a href="${payload.uploadResultCSV}" target="_blank"> Download do Relatório CSV </a> <br /><br />
                      <a href="${payload.uploadResultXLSX}" target="_blank"> Download do Relatório XLSX </a>


                      <br/><br/>
                      <span>
                          Para quaisquer dúvidas ou esclarecimentos, por favor entre em contato com a equipe de Projetos.
                      </span>

                      <br/><br/>
                      <p>Atenciosamente,<br/><br/> Íris<br/>Assistente Virtual</p>
                  </div>
              </div>
          </body>
        </html>
      `,
    };

    return await transporter.sendMail(mailOptions);
  }

  public async sendFollowUpEmail(payload: any) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'no-reply@accesslogistics.com.br',
        pass: '03od8Hb)$q4M',
      },
    });

    const mailOptions = {
      from: 'no-reply@accesslogistics.com.br',
      to: payload.to,
      subject: `Relatório de Cliente - ${payload.client}`,
      html: `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        color: #333;
                    }
                    .container {
                        width: 100%;
                        max-width: 700px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border: 1px solid #e0e0e0;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background-color: #023f88;
                        padding: 20px;
                        text-align: center;
                        color: #ffffff;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .info-section {
                        padding: 20px;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    .info-section h2 {
                        color: #023f88;
                        font-size: 18px;
                        margin-bottom: 5px;
                    }
                    .info-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                        font-size: 14px;
                    }
                    .info-row div {
                        font-size: 14px;
                    }
                    .table-section {
                        padding: 20px;
                    }
                    .single-row-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 15px;
                    }
                    .single-row-table th, .single-row-table td {
                        padding: 10px;
                        text-align: left;
                        font-size: 14px;
                        border: 1px solid #ddd;
                        background-color: #f9f9f9;
                        vertical-align: top;
                    }
                    .single-row-table th {
                        background-color: #023f88;
                        color: #ffffff;
                    }
                    .description p {
                        margin: 10px 0;
                        line-height: 1.5;
                    }
                    .footer {
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <!-- Header Section -->
                    <div class="header">
                        <h1>RELATÓRIO CLIENTE</h1>
                    </div>

                    <!-- Info Section -->
                    <div class="info-section">
                        <h2>Informações do Cliente</h2>
                        <div class="info-row">
                            <div><strong>Cliente:</strong> ${payload.client}</div>
                            <div><strong>Vendedor:</strong> ${payload.seller}</div>
                        </div>
                        <div class="info-row">
                            <div><strong>Data:</strong> ${payload.followDate}</div>
                            <div><strong>Tipo:</strong> ${payload.followType}</div>
                            <div><strong>Responsável:</strong> ${payload.followUser}</div>
                        </div>
                    </div>

                    <div class="table-section">
                        <table class="single-row-table" style="margin-bottom: 0px;">
                            <tr>
                                <th>Título do Acompanhamento</th>
                            </tr>
                            <tr>
                                <td>${payload.followTitle}</td>
                            </tr>
                        </table>
                    </div>

                    <div class="table-section">
                        <table class="single-row-table" style="margin-top: 0px;">
                            <tr>
                                <th>Descrição</th>
                            </tr>
                            <tr>
                                <td class="description">
                                    ${payload.followDescription
                                      .split('\n\n')
                                      .map((paragraph) => `<p>${paragraph}</p>`)
                                      .join('')}
                                </td>
                            </tr>
                        </table>
                    </div>

                    <!-- Footer Section -->
                    <div class="footer">
                        <p>Para quaisquer dúvidas ou esclarecimentos, entre em contato com a equipe de Projetos.</p>
                        <p>Atenciosamente,</p>
                        <p><strong>Íris</strong><br>Assistente Virtual</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    return await transporter.sendMail(mailOptions);
  }
}
