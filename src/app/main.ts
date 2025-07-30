import { Express, Request, Response } from 'express';
import { Method } from './interfaces/Method.enum';
import { Controllers } from './config/Controllers';
import { Controller } from './controllers/Controller';
import { Sequelize } from 'sequelize';
import { Models } from './config/Models';
import { CustomRoutes } from './config/CustomRoutes';

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
            this.express[Method.GET](`/${ctrl.path}`, (req: Request, res: Response) => {
                this.prepareController(ctrl, Method.GET, req, res);
            });
            this.express[Method.GET](`/${ctrl.path}/:id`, (req: Request, res: Response) => {
                this.prepareController(ctrl, Method.GET_BY_ID, req, res);
            });
            this.express[Method.POST](`/${ctrl.path}`, (req: Request, res: Response) => {
                this.prepareController(ctrl, Method.POST, req, res);
            });
            this.express[Method.PUT](`/${ctrl.path}/:uid`, (req: Request, res: Response) => {
                this.prepareController(ctrl, Method.PUT, req, res);
            });
            this.express[Method.DELETE](`/${ctrl.path}/:uid`, (req: Request, res: Response) => {
                this.prepareController(ctrl, Method.DELETE, req, res);
            });
            this.prepareCustomEndpoints(ctrl);
        }
    }

    private prepareController(controller: Controller, method: Method, req: Request, res: Response): void {
        controller.jwt = req.headers.authorization;
        controller[method](req, res);
    }

    private prepareCustomEndpoints(controller: Controller) {
        if (!CustomRoutes[controller.path]) {
            return;
        }

        for (const [path, route] of Object.entries(CustomRoutes[controller.path])) {
            let method = route.method;

            if (route.method === Method.GET_BY_ID) {
                method = Method.GET;
            }

            (this.express as any)[method](`/${controller.path}/${path}`, (req: Request, res: Response) => {
                (controller as any)[route.endpoint](req, res);
            });
        }
    }
}
