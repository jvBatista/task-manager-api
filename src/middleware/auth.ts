import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export default class AuthService {
    generateToken(data: object) {
        return jwt.sign(data, process.env.AUTH_CONFIG_SECRET as string, {});
    }

    decodeToken = async (token: string) => {
        const data = Buffer.from(token.split('.')[1], 'base64').toString();
        return data;
    };

    authorize = (req: Request, res: Response, next: () => void) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({
                message: 'Não autorizado',
            });
        } else {
            jwt.verify(
                token,
                process.env.AUTH_CONFIG_SECRET as string,
                (error: any) => {
                    if (error) {
                        console.log(error);
                        res.status(401).json({
                            message: 'Token Inválido',
                        });
                    } else {
                        next();
                    }
                }
            );
        }
    };
}