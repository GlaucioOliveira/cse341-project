const express = require('express');
const bodyParser = require('body-parser');
const dbClient = require('./db/client');
const port = process.env.PORT || 8080;
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const { auth, requiresAuth } = require('express-openid-connect');

const AuthConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

app
  .use(auth(AuthConfig)) //attaches /login, /logout, and /callback routes to the app
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  })
  .use(bodyParser.json())
  .use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Content-Type', 'application/json');
    next();
  })
  .use('/', require('./routes'));


process.on('uncaughtException', (err, origin) => {
  console.log(process.stderr, `Unhandled Exception: ${err}. Source: ${origin}`)
});

dbClient.initializeDatabaseClient((error) => {
  if (error) {
    console.log(error);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
