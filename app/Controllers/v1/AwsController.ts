import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Application from '@ioc:Adonis/Core/Application';
import fs from 'fs';
import AwsService from 'App/Services/v1/AwsService';
import utils from 'Utils/utils';

export default class AwsController {
  private awsService: AwsService = new AwsService();

  public async create(context: HttpContextContract) {
    try {
      const files = context.request.files('files');
      const attachmentIds = context.request.input('attachment_ids', []);

      if (!files || files.length === 0) {
        return utils.handleError(context, 400, 'BAD_REQUEST', 'Nenhum arquivo foi enviado.');
      }

      if (attachmentIds.length > 0 && attachmentIds.length !== files.length) {
        return utils.handleError(
          context,
          400,
          'BAD_REQUEST',
          'O número de attachment_ids deve corresponder ao número de arquivos.'
        );
      }

      const tmpPath = Application.tmpPath('uploads');
      const uploadPromises = files.map(async (file, index) => {
        const attachmentId = attachmentIds[index] || null;
        await file.move(tmpPath);
        const fullPath = `${tmpPath}/${file.fileName}`;

        try {
          const fileContent = fs.readFileSync(fullPath);
          const result = await this.awsService.upload(
            file.clientName,
            `${file.type}/${file.subtype}`,
            fileContent,
            attachmentId
          );
          return { attachment_id: attachmentId, s3_url: result.s3_url };
        } finally {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      });

      const results = await Promise.all(uploadPromises);
      return utils.handleSuccess(context, results, 'CREATE_SUCCESS', 200);
    } catch (error) {
      return utils.handleError(context, 500, 'INTERNAL_SERVER_ERROR', error.message);
    }
  }
}
