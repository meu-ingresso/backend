import http from 'http';
import { URLSearchParams } from 'url';
import { flatten } from 'q-flat';
import HttpResponse from 'App/Models/Transfer/HttpResponse';

export default class HttpService {
  public options;
  public protocols;

  constructor(options?) {
    this.options = options;
    this.protocols = { http };
  }

  public async get(path: string, options: any, query: any = undefined): Promise<HttpResponse> {
    const params = new URLSearchParams(flatten(query));

    return this.request({
      method: 'GET',
      path: `${path}?${params.toString()}`,
      ...options,
    });
  }

  public async post(path, options, body = {}): Promise<HttpResponse> {
    return this.request(
      {
        method: 'POST',
        path,
        ...options,
      },
      body
    );
  }

  public async patch(path, options, body = {}): Promise<HttpResponse> {
    return this.request(
      {
        method: 'PATCH',
        path,
        ...options,
      },
      body
    );
  }

  public async request(options, body?): Promise<HttpResponse> {
    return new Promise((resolve, reject) => {
      const req = this.protocols['http:'].request({ ...this.options, ...options }, (res) => {
        let chunks: any = '';
        res.setEncoding('utf8');
        res.on('data', (data) => (chunks += data));

        res.on('end', () => {
          const result = {
            status: res.statusCode,
            headers: res.headers,
            body: this.requestParse(res.headers, chunks),
          };

          if (res.statusCode < 200 || res.statusCode > 299) {
            reject(result);
          } else {
            resolve(result);
          }
        });
      });

      req.on('error', (err) => {
        console.error(err);
        reject({ status: 500 });
      });

      if (body) {
        req.write(body);
      }

      req.end();
    });
  }

  public requestParse(headers, chunks) {
    let resBody = chunks;
    let contentType = headers['content-type'] ? headers['content-type'].split(';')[0] : 'application/json';
    switch (contentType) {
      case 'application/json':
        resBody = chunks ? JSON.parse(chunks) : chunks;
        break;
    }
    return resBody;
  }
}
