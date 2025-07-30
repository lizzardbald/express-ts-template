import { Method } from '../interfaces/Method.enum';
import { Routes } from './Routes.enum';

export interface ICustomRoute {
    endpoint: string;
    method: Partial<Method>;
}

export class CustomRoutes {
    static [Routes.Users]: Record<string, ICustomRoute> = {
        customEndpoint: {
            endpoint: 'customEndpoint',
            method: Method.POST,
        },
    };
}
