import { Request, Response } from 'express';
import { Routes } from '../../config/Routes.enum';
import { Method } from '../../interfaces/Method.enum';
import { Controller } from '../Controller';
import { Prisma } from '@prisma/client';
import { UserService } from '../../services/user/User.service';

export class UsersController extends Controller {
    public static path: Routes = Routes.Users;
    private readonly userService: UserService;
    /**
     * Set the route for this controller in super()
     */
    constructor() {
        super(Routes.Users);
        this.userService = new UserService();
    }

    public async [Method.GET_BY_ID](request: Request, response: Response) {
        response.send('get user by id');
    }

    public async [Method.GET](request: Request, response: Response) {
        const users = await this.userService.getUsers();
        response.send(JSON.stringify(users));
    }

    public async [Method.POST](request: Request, response: Response) {
        throw new Error('Not implemented');
    }

    public [Method.PUT](request: Request, response: Response): void {
        response.send('users put ' + request.params.uid);
    }

    public [Method.DELETE](request: Request, response: Response): void {
        response.send('users delete ' + request.params.uid);
    }

    public customEndpoint(request: Request, response: Response) {
        response.send('custom');
    }
}
