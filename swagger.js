const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'WatchList Movies API',
    description: 'WatchList Movies API Information',
  },
  host: 'cse341-project-yrv7.onrender.com',
  schemes: ['https'],
  securityDefinitions: {
    OAuth2: {
      type: 'oauth2',
      description: 'OAuth2 authentication using Auth0',
      flow: 'accessCode',
      authorizationUrl: 'https://dev-2ksmol8sfp1zk1dy.us.auth0.com/authorize',
      tokenUrl: 'https://dev-2ksmol8sfp1zk1dy.us.auth0.com/oauth/token',
      scopes: {
        'write': 'Write access'
      }
    }
  },
  security: [
    {
      OAuth2: ['write']
    }
  ]  
};

const outputFile = './swagger-output.json';
const routes = ['./server.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);