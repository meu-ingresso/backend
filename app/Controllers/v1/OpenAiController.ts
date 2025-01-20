import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { CreateOpenAiValidator } from 'App/Validators/v1/OpenAiValidator';
import OpenAiService from 'App/Services/v1/OpenAiService';
import utils from 'Utils/utils';

export default class TicketsController {
  private openAiService: OpenAiService = new OpenAiService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateOpenAiValidator);

    const baseRequest = `Você tem a seguinte descrição do evento: \n\n`;

    const finalRequest = `\n\n Melhore e me entregue a melhor e mais sucinta versão em português, seguindo um padrão e deixando um texto único. Não altere o contexto, não omita e nem invente dados em nenhuma hipótese. Apenas melhore o texto com as informações repassadas. \n\n`;

    const request = baseRequest + payload.event_description + finalRequest;

    await utils.createAudity('CREATE', 'OPEN_AI', null, context.auth.user?.$attributes.id, null, { request });

    const result = await this.openAiService.create({
      messages: [
        {
          role: 'user',
          content: request,
        },
      ],
    });

    await utils.createAudity('RESPONSE', 'OPEN_AI', null, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('IMPROVE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
