import { BodyParserConfig } from '@ioc:Adonis/Core/BodyParser';

const bodyParserConfig: BodyParserConfig = {
  whitelistedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],

  json: {
    encoding: 'utf-8',
    limit: '10mb',
    strict: true,
    types: ['application/json', 'application/json-patch+json', 'application/vnd.api+json', 'application/csp-report'],
  },

  form: {
    encoding: 'utf-8',
    limit: '10mb',
    queryString: {},

    convertEmptyStringsToNull: true,

    types: ['application/x-www-form-urlencoded'],
  },

  raw: {
    encoding: 'utf-8',
    limit: '10mb',
    queryString: {},
    types: ['text/*'],
  },

  multipart: {
    autoProcess: true,

    processManually: [],

    // tmpFileName () {
    // },

    encoding: 'utf-8',

    convertEmptyStringsToNull: true,

    maxFields: 1000,

    limit: '20mb',

    types: ['multipart/form-data'],
  },
};

export default bodyParserConfig;
