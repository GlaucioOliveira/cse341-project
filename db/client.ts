import dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';

dotenv.config();

// Private field for database client
let _databaseClient: MongoClient | null = null;

export const initializeDatabaseClient = (callback: (error: Error | null, client?: MongoClient) => void): void => {
    if (_databaseClient) {
        console.log('_databaseClient is already initialized!');
        return callback(null, _databaseClient);
    }

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        return callback(new Error('MONGO_URI is not defined in the environment variables.'));
    }

    MongoClient.connect(mongoUri)
        .then((databaseClient) => {
            _databaseClient = databaseClient;
            callback(null, _databaseClient);
        })
        .catch((error) => callback(error));
};

export const getDatabaseClient = (): MongoClient => {
    if (!_databaseClient) {
        throw new Error('Database client not initialized');
    }
    return _databaseClient;
};


export default { initializeDatabaseClient, getDatabaseClient };