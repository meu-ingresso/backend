import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Application from '@ioc:Adonis/Core/Application';
import fs from 'fs';
import AwsService from 'App/Services/v1/AwsService';
import utils from 'Utils/utils';

export default class AwsController {
  private awsService: AwsService = new AwsService();

  public async create(context: HttpContextContract) {
    try {
      const fileAttached = context.request.file('file');
      const event_attachment_id = context.request.input('event_attachment_id');

      if (!fileAttached) {
        return utils.handleError(context, 400, 'BAD_REQUEST', 'Nenhum arquivo foi enviado.');
      }

      const tmpPath = Application.tmpPath('uploads');
      await fileAttached.move(tmpPath);
      const fullPath = `${tmpPath}/${fileAttached.fileName}`;

      try {
        const fileContent = fs.readFileSync(fullPath);
        const result = await this.awsService.upload(
          fileAttached.clientName,
          `${fileAttached.type}/${fileAttached.subtype}`,
          fileContent,
          event_attachment_id
        );

        return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 200);
      } finally {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    } catch (error) {
      return utils.handleError(context, 500, 'INTERNAL_SERVER_ERROR', error.message);
    }
  }
}
