import { Method } from '../Method.enum';

export interface ICustomRoute {
    endpoint: string;
    method: Partial<Method>;
}
