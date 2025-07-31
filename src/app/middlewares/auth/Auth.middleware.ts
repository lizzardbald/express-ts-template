import { Request, Response, NextFunction } from 'express';
import { BasicMiddleware } from '../../interfaces/middleware/BasicMiddleware.interface';

export class AuthMiddware implements BasicMiddleware {
    public process(request: Request, response: Response, next: NextFunction): void | Promise<void> {
        next();
    }
}
