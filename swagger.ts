import swaggerAutogen from 'swagger-autogen';

const swaggerGen = swaggerAutogen() as any;

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
                write: 'Write access',
            },
        },
    },
    security: [
        {
            OAuth2: ['write'],
        },
    ],
};

const routes = ['./server.ts'];

swaggerGen('./dist/swagger-output.json', routes, doc);
swaggerGen('./swagger-output.json', routes, doc);
