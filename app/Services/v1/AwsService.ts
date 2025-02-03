import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import Env from '@ioc:Adonis/Core/Env';

export default class AwsService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor() {
    this.bucketName = Env.get('AWS_BUCKET_NAME');
    this.region = Env.get('AWS_REGION');

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: Env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: Env.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  public async upload(name: string, type: string, fileContent: Buffer, attachment_id?: string | null): Promise<any> {
    if (!name || !type || !fileContent) {
      throw new Error('Nome do arquivo, tipo e conteúdo são obrigatórios');
    }

    const fileKey = attachment_id ? `${attachment_id}${name}` : name;
    const encodedKey = encodeURIComponent(fileKey).replace(/%20/g, '+');

    const putObjectParams = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: fileContent,
      ContentType: type,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(putObjectParams));

      const finalUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${encodedKey}`;
      return { s3_url: finalUrl };
    } catch (error) {
      console.error('Erro no upload para S3:', error);
      throw new Error('Falha ao fazer upload do arquivo para o S3');
    }
  }
}
