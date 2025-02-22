import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { CreateOpenAiValidator } from 'App/Validators/v1/OpenAiValidator';
import OpenAiService from 'App/Services/v1/OpenAiService';
import utils from 'Utils/utils';

export default class TicketsController {
  private openAiService: OpenAiService = new OpenAiService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateOpenAiValidator);

    const baseRequest = `Você tem a seguinte descrição do evento: \n\n`;

    const finalRequest = `\n\nMelhore e entregue a melhor versão em português. Siga rigorosamente o estilo de comunicação que o promotor utilizou, reproduzindo o tom, a informalidade, as expressões e a energia presentes no texto original. Não altere o contexto, não omita informações, nem invente dados em nenhuma hipótese. Se o texto contiver informalidades, gírias ou repetições exageradas, mantenha e realce esse estilo ao melhorar o texto. Apenas otimize a redação mantendo o estilo e o tom pretendido pelo promotor. \n\n`;

    const request = baseRequest + payload.event_description + finalRequest;

    utils.createAudity('CREATE', 'OPEN_AI', null, context.auth.user?.$attributes.id, null, { request });

    const result = await this.openAiService.create({
      messages: [
        {
          role: 'user',
          content: request,
        },
      ],
    });

    utils.createAudity('RESPONSE', 'OPEN_AI', null, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('IMPROVE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
