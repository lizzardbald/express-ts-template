import express, { Express, json } from 'express';
import { Main } from './app/main';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(helmet());
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);

new Main(app).bootstrap();

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
