const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'WatchList Movies API',
    description: 'WatchList Movies API Information',
  },
  host: 'cse341-fetp.onrender.com'
};

const outputFile = './swagger-output.json';
const routes = ['./server.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);