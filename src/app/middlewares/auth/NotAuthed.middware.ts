import { Request, Response, NextFunction } from 'express';
import { ErrorMiddleware } from '../../interfaces/middleware/ErrorMiddleware.interface';

export class NotAuthneticatedMiddleware implements ErrorMiddleware {
    public process(error: any, request: Request, response: Response, next: NextFunction): void | Promise<void> {
        response.status(500).send({ message: error.message });
    }
}
