const express = require('express');
const bodyParser = require('body-parser');
const dbClient = require('./db/client');
const port = process.env.PORT || 8080;
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');


app
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use(bodyParser.json())
  .use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Content-Type', 'application/json');
    next();
  })
  .use('/', require('./routes'));

dbClient.initializeDatabaseClient((error) => {
  if (error) {
    console.log(error);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
