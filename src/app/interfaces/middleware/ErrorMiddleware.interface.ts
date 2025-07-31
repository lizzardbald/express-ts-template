import { NextFunction, Request, Response } from 'express';

export interface ErrorMiddleware {
    process(error: any, request: Request, response: Response, next: NextFunction): void | Promise<void>;
}
