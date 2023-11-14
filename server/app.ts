import express, { Express } from 'express';
import cors from 'cors';

import walletRoute from './routes';
import { errorHandler } from './middlewares';

const app: Express = express();

app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));
app.use(express.json());

// Routes
app.use(`/api/wallet`, walletRoute);

// Middlewares
app.use(errorHandler);

export default app;
