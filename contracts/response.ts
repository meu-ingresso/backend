import HttpBody from "App/Models/Transfer/HttpBody";
import HttpHeader from "App/Models/Transfer/HttpHeader";
import HttpResponse from "App/Models/Transfer/HttpResponse";

declare module '@ioc:Adonis/Core/Response' {
  interface ResponseContract {
    standard(res: HttpResponse): this
  }

  interface ResponseContract {
    default(body: HttpBody, headers?: HttpHeader[], status?: number): this
  }
}