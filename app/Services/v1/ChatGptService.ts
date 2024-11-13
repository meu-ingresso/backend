import { Configuration, OpenAIApi } from 'openai';
import Env from '@ioc:Adonis/Core/Env';
import utils from 'Utils/utils';

export default class ChatGptService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: Env.get('OPENAI_API_KEY'),
    });

    this.openai = new OpenAIApi(configuration);
  }

  public async create(userId: number, data: any): Promise<any> {
    try {
      utils.createAudity(userId, 'openai', 'create', JSON.stringify(data));

      const chatCompletions = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages: data.messages,
        temperature: 0,
      });

      if (
        chatCompletions &&
        chatCompletions.data &&
        chatCompletions.data.choices &&
        chatCompletions.data.choices.length
      ) {
        const responseMessage = chatCompletions.data.choices[0].message;

        utils.createAudity(userId, 'openai', 'result-success', JSON.stringify(responseMessage?.content));

        return responseMessage?.content;
      }

      utils.createAudity(userId, 'openai', 'result-error', JSON.stringify(chatCompletions));

      return '';
    } catch (err) {
      console.error(err);
      return err;
    }
  }
}
