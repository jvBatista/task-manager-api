import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export default class AuthService {
    generateToken(data: object) {
        return jwt.sign(data, process.env.AUTH_CONFIG_SECRET as string, {
            expiresIn: 86400,
        });
    }

    decodeToken = async (token: string) => {
        const data = Buffer.from(token.split('.')[1], 'base64').toString();
        return data;
    };

    authorize = (req: Request, res: Response, next: () => void) => {
        const header = req.headers.authorization;

        if (!header) res.status(401).json({ message: 'Não autorizado' });

        const parts = header?.split(' ');

        if (parts?.length !== 2) return res.status(401).json({ message: 'Token Inválido' });

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: 'Token Inválido' });

        jwt.verify(
            token,
            process.env.AUTH_CONFIG_SECRET as string,
            (error, decoded: any) => {
                if (error) {
                    if (error.name === "TokenExpiredError") return res.status(401).json({ message: 'Login expirado' });

                    return res.status(401).json({ message: 'Token Inválido' });
                } else {
                    req.userId = decoded?.id;
                    return next();
                }
            }
        );
    };
}