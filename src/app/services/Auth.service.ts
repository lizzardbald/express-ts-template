import * as jwt from 'jsonwebtoken';

export class AuthService {
    private readonly JWT_SECRET: string = process.env.JWT_SECRET as string;
    private readonly JWT_EXPIRES_IN: number = Number(process.env.JWT_EXPIRES_IN);

    public generateToken(userId: string) {
        return jwt.sign({ id: userId }, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN,
        });
    }

    public verifyToken(token: string) {
        return jwt.verify(token, this.JWT_SECRET);
    }

    public decodeToken(token: string) {
        const tokenPart = token.split(' ')[1];
        return jwt.decode(tokenPart);
    }
}
