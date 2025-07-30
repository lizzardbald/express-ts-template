import { Express, Request, Response } from 'express';
import { Method } from './interfaces/Method.enum';
import { Controllers } from './config/Controllers';
import { Controller } from './controllers/Controller';
import { Sequelize } from 'sequelize';
import { Models } from './config/Models';
import { CustomRoutes } from './config/CustomRoutes';
import { Router } from 'express';

export class Main {
    public express: Express;
    private readonly dbContext: Sequelize;

    constructor(_express: Express) {
        this.express = _express;
        this.dbContext = new Sequelize(
            process.env.DB_NAME || 'mydatabase',
            process.env.DB_USER || 'postgres',
            process.env.DB_PASSWORD || 'mysecretpassword',
            {
                host: process.env.DB_HOST || '127.0.0.1',
                dialect: 'postgres', // Specify dialect
                logging: false,
            }
        );
    }

    public init(): void {
        this.initOrm();
        this.createControllers();
    }

    private initOrm(): void {
        const models = new Models();
        const modelMap = models.create(this.dbContext);

        models.associate(modelMap);

        this.dbContext
            .sync({ alter: true })
            .then(() => {
                console.log('Database synced');
            })
            .catch((error) => {
                console.error(error.message);
            });
    }

    private createControllers(): void {
        const controllers = new Controllers().create(this.dbContext);

        for (const ctrl of controllers) {
            const router = Router();

            router[Method.GET](`/`, (req: Request, res: Response) => {
                this.prepareController(ctrl, Method.GET, req, res);
            });
            router[Method.GET](`/:uid`, (req: Request, res: Response) => {
                this.prepareController(ctrl, Method.GET_BY_ID, req, res);
            });
            router[Method.POST](`/`, (req: Request, res: Response) => {
                this.prepareController(ctrl, Method.POST, req, res);
            });
            router[Method.PUT](`/:uid`, (req: Request, res: Response) => {
                this.prepareController(ctrl, Method.PUT, req, res);
            });
            router[Method.DELETE](`/:uid`, (req: Request, res: Response) => {
                this.prepareController(ctrl, Method.DELETE, req, res);
            });

            this.prepareCustomEndpoints(ctrl, router);

            this.express.use(`/${ctrl.path}`, router);
        }
    }

    private prepareController(controller: Controller, method: Method, req: Request, res: Response): void {
        controller.jwt = req.headers.authorization;
        controller[method](req, res);
    }

    private prepareCustomEndpoints(controller: Controller, router: Router) {
        if (!CustomRoutes[controller.path]) {
            return;
        }

        for (const [path, route] of Object.entries(CustomRoutes[controller.path])) {
            let method = route.method;

            if (route.method === Method.GET_BY_ID) {
                method = Method.GET;
            }

            (router as any)[method](`/${path}`, (req: Request, res: Response) => {
                (controller as any)[route.endpoint](req, res);
            });
        }
    }
}
