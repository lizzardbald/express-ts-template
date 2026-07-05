import { Method } from '../interfaces/Method.enum';
import { ICustomRoute } from '../interfaces/routes/CustomRoutes';
import { Routes } from './Routes.enum';

export class CustomRoutes {
    static [Routes.Users]: ICustomRoute[] = [
        {
            endpoint: 'customEndpoint',
            method: Method.POST,    
        },
    ];
}
