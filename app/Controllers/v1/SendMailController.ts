import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import SendMailService from 'App/Services/v1/SendMailService';
import utils from 'Utils/utils';

export default class SendMailController {
  private sendMailService = new SendMailService();

  public async sendMail(context: HttpContextContract) {
    await this.sendMailService.sendMail();

    return utils.handleSuccess(context, 'E-mail enviado com sucesso', 'SEND_SUCCESS', 200);
  }
}
