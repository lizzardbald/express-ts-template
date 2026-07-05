import { Request, Response } from 'express';
import { Routes } from '../../config/Routes.enum';
import { Method } from '../../interfaces/Method.enum';
import { Controller } from '../Controller';
import { User } from '../../models/User.model';
import * as bcrypt from 'bcrypt';

export class UsersController extends Controller {
    public static path: Routes = Routes.Users;
    /**
     * Set the route for this controller in super()
     */
    constructor() {
        super(Routes.Users);
    }

    public async [Method.GET_BY_ID](request: Request, response: Response) {
        response.send('get user by id');
    }

    public async [Method.GET](request: Request, response: Response) {
        response.send('get users');
    }

    public async [Method.POST](request: Request, response: Response) {
        const salt = await bcrypt.genSalt();
        const passHash = await bcrypt.hash('strong pass', salt);
        const user = await User.create({
            id: crypto.randomUUID(),
            name: 'opa',
            password: passHash,
            freeRequests: 20,
        });

        response.send('users post ' + user.id);
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
