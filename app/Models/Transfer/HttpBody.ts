import HttpResponseCode from 'App/Models/Transfer/HttpResponseCode'
import HttpResponseError from 'App/Models/Transfer/HttpResponseError'
import HttpResponseResult from 'App/Models/Transfer/HttpResponseResult'

type HttpBody = {
  code: HttpResponseCode,
  result: [ HttpResponseResult | HttpResponseError ] | HttpResponseResult | HttpResponseError
}

export default HttpBody;