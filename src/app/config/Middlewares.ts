import { Constructable } from '../interfaces/Constructable.interface';
import { BasicMiddleware } from '../interfaces/middleware/BasicMiddleware.interface';
import { ErrorMiddleware } from '../interfaces/middleware/ErrorMiddleware.interface';
import { AuthMiddware } from '../middlewares/auth/Auth.middleware';
import { NotAuthneticatedMiddleware } from '../middlewares/auth/NotAuthed.middware';
import { Routes } from './Routes.enum';

export class Middlewares {
    static [Routes.Users]: Constructable<BasicMiddleware | ErrorMiddleware>[] = [
        AuthMiddware,
        NotAuthneticatedMiddleware,
    ];
}
