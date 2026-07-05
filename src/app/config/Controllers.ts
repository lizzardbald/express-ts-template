import { Controller } from '../controllers/Controller';
import { UsersController } from '../controllers/users/Users.controller';
import { Constructable } from '../interfaces/Constructable.interface';

export class Controllers {
    /**
     * Add type referance to controllers here
     */
    public static controllers: Constructable<Controller>[] = [UsersController];
}
