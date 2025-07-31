import { Method } from '../interfaces/Method.enum';
import { ICustomRoute } from '../interfaces/routes/CustomRoutes';
import { Routes } from './Routes.enum';

export class CustomRoutes {
    static [Routes.Users]: Record<string, ICustomRoute> = {
        customEndpoint: {
            endpoint: 'customEndpoint',
            method: Method.POST,
        },
    };
}
