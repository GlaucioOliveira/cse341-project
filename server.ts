import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import {initializeDatabaseClient} from './db/client';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
import { auth, requiresAuth, ConfigParams } from 'express-openid-connect';
import router from './routes';

const port: number = parseInt(process.env.PORT || '8080', 10);
const app = express();

const AuthConfig: ConfigParams = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET || '',
    baseURL: process.env.BASE_URL || '',
    clientID: process.env.CLIENT_ID || '',
    issuerBaseURL: process.env.ISSUER_BASE_URL || '',
};

app
    .use(auth(AuthConfig)) // Attaches /login, /logout, and /callback routes to the app
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .get('/profile', requiresAuth(), (req: Request, res: Response) => {
        res.send(JSON.stringify(req.oidc?.user));
    })
    .use(bodyParser.json())
    .use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
        );
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .use('/', router);

process.on('uncaughtException', (err: Error, origin: string) => {
    console.error(`Unhandled Exception: ${err}. Source: ${origin}`);
});

initializeDatabaseClient((error?: any) => {
    if (error) {
        console.error(error);
    } else {
        app.listen(port, () => {
            console.log(`Connected to DB and listening on port ${port}`);
        });
    }
});
