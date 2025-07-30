import { Express } from 'express';
import { Method } from './interfaces/Method.enum';
import { Controllers } from './utils/Controllers';

export class Main {

    public express: Express;

    constructor(_express: Express) {
        this.express = _express;    
    }

    public init(): void {
        this.createControllers();
    }

    private createControllers(): void {
        // const controllers = new Controllers().create(this.dbContext);
        const controllers = new Controllers().create();

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
            console.log('once');

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
