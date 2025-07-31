import express, { Express } from 'express';
import { Main } from './app/main';
import dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(helmet());

new Main(app).bootstrap();

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
