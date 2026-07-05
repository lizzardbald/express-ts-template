import { Prisma } from "../prisma/Prisma";

export interface UserAttributes {
    id: string;
    names: string;
    email: string;
    password: string;
    roles?: Array<{ id: string; roleId: string; userId: string }>;
    createdAt?: Date;
    updatedAt?: Date;
}

export class UserService {
    private prisma = Prisma.context;

    public async getUsers(): Promise<UserAttributes[]> {
        return await this.prisma.users.findMany();
    }
}