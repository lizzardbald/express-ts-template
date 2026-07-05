import { Express, NextFunction, Request, Response } from 'express';
import { Method } from './interfaces/Method.enum';
import { Controllers } from './config/Controllers';
import { Controller } from './controllers/Controller';
import { CustomRoutes } from './config/CustomRoutes';
import { Router } from 'express';
import { Middlewares } from './config/Middlewares';
import { Constructable } from './interfaces/Constructable.interface';
import { ErrorMiddleware } from './interfaces/middleware/ErrorMiddleware.interface';
import { BasicMiddleware } from './interfaces/middleware/BasicMiddleware.interface';
import { Logger } from './services/logger/Logger.service';
import { WebSocketService } from './services/web-socket/WebSocket.service';
import { Server } from 'http';
import { Prisma } from './services/prisma/Prisma';

export class Main {
    public express: Express;
    private server!: Server;

    constructor(_express: Express) {
        this.express = _express;
    }

    public bootstrap(): void {
        this.setGlobalErrorHandler()
        this.initOrm()
        .then(() => {
            this.createControllers();
            this.startWebServer();
            this.startWebSocket();
        })
        .catch((error: any) => {
            Logger.error(error.message);
        });
    }

    private async initOrm(): Promise<void> {
        await Prisma.context.$connect()
        .then(() => {
            Logger.log('Prisma connected successfully');
        })
        .catch((error: any) => {
            Logger.error(error.message);
        });
    }

    private createControllers(): void {
        for (const ctrl of Controllers.controllers) {
            const router = Router();

            this.prepareMiddlewares(ctrl, router);

            router[Method.GET](
                `/`,
                (req: Request, res: Response, next: NextFunction) => {
                    this.prepareController(ctrl, Method.GET, req, res, next);
                },
            );
            router[Method.POST](
                `/`,
                (req: Request, res: Response, next: NextFunction) => {
                    this.prepareController(ctrl, Method.POST, req, res, next);
                },
            );
            router[Method.PUT](
                `/:id`,
                (req: Request, res: Response, next: NextFunction) => {
                    this.prepareController(ctrl, Method.PUT, req, res, next);
                },
            );
            router[Method.DELETE](
                `/:id`,
                (req: Request, res: Response, next: NextFunction) => {
                    this.prepareController(ctrl, Method.DELETE, req, res, next);
                },
            );

            this.prepareCustomEndpoints(ctrl, router);

            this.express.use(`/${ctrl.path}`, router);
        }
    }

    private prepareMiddlewares(controller: Constructable<Controller>, router: Router) {
        if (!Middlewares[controller.path!]?.length) {
            return;
        }

        const middlewaresForRoute = Middlewares[controller.path!].map((ml: Constructable<BasicMiddleware | ErrorMiddleware>) => new ml());

        for (const middleware of middlewaresForRoute) {
            router.use('/', middleware.process);
        }

        Logger.log('Middlewares prepare');
    }

    private prepareController(
        controller: Constructable<Controller>,
        method: Method,
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        const instance = new controller();

        instance.jwt = req.headers.authorization;
        instance[method](req, res, next);
    }

    private prepareCustomEndpoints(controller: Constructable<Controller>, router: Router) {
 if (!CustomRoutes[controller.path!]?.length) {
            return;
        }

        for (const { endpoint, method } of CustomRoutes[controller.path!]) {
            (router as any)[method](
                `/${endpoint}`,
                (req: Request, res: Response, next: NextFunction) => {
                    const instance = new controller();
                    instance.jwt = req.headers.authorization;
                    (instance as any)[endpoint](req, res, next);
                },
            );
        }
    }

    private startWebServer(): void {
        const port = process.env.PORT || 8080;

        this.server = this.express.listen(port, () => {
            let message = 'HTTP Server is started';

            if (process.env.NODE_ENV === 'development') {
                message = `HTTP Server is started in development mode on port ${port}`;
            }

            Logger.log(message);
        });
    }

    private startWebSocket(): void {
        Logger.log('Starting WebSocket...');
        WebSocketService.createWebSockerInstance(this.server as any);
    }
    
    private setGlobalErrorHandler(): void {
        process.on('uncaughtException', (err: Error) => {
            if (process.env.NODE_ENV === 'development') {
                console.error(err);
            } else {
                Logger.error(`There was an uncaught error: ${err.message}`);
            }
        });

        process.on('unhandledRejection', (err: Error) => {
            if (process.env.NODE_ENV === 'development') {
                console.error(err);
            } else {
                Logger.error(`There was an unhadled error: ${err.message}`);
            }
        });
    }
}
