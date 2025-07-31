import { NextFunction, Request, Response } from 'express';

import { IController } from '../interfaces/IController.interface';
import { AuthService } from '../services/Auth.service';
import { User } from '../models/User.model';
import { Routes } from '../config/Routes.enum';

export abstract class Controller implements IController {
    public path: Routes;
    public authService: AuthService;
    public jwt!: string | undefined;

    constructor(_path: Routes) {
        this.path = _path;
        this.authService = new AuthService();
    }

    public async getUser(): Promise<User> {
        const decodedToken: any = this.authService.decodeToken(this.jwt as string);
        const user = await User.findByPk(decodedToken.id);

        return user as User;
    }

    abstract getById(request: Request, response: Response, next?: NextFunction): void;
    abstract get(request: Request, response: Response, next?: NextFunction): void;
    abstract post(request: Request, response: Response, next?: NextFunction): void;
    abstract put(request: Request, response: Response, next?: NextFunction): void;
    abstract delete(request: Request, response: Response, next?: NextFunction): void;
}
