import HttpHeader from 'App/Models/Transfer/HttpHeader'
import HttpBody from 'App/Models/Transfer/HttpBody'

export default interface HttpResponse {
  headers: [ HttpHeader ];
  status: number;
  body: HttpBody;
}