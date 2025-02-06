const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

//private fields
let _databaseClient;

const initializeDatabaseClient = (callback) => {
  if (_databaseClient) {
    console.log('_databaseClient is already initialized!');
    return callback(null, _databaseClient);
  }

  MongoClient.connect(process.env.MONGO_URI)
    .then((databaseClient) => {
      _databaseClient = databaseClient;      
      
      callback(null, _databaseClient);
    })
    .catch((error) => callback(error));
};

const getDatabaseClient = () => {
  if (!_databaseClient) throw Error('databaseClient not initialized');

  return _databaseClient;
};

module.exports = { initializeDatabaseClient, getDatabaseClient };
