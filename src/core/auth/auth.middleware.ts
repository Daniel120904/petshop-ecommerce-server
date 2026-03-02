import { Request, Response, NextFunction } from 'express';
import authService from './auth.service';
import { PermissionLevel, PERMISSIONS } from '../../utils/constants/permission.constants';
import { pathToRegexp } from 'path-to-regexp';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email: string;
                permission: PermissionLevel;
            };
        }
    }
}

class AuthMiddleware {
    async authenticate(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    message: 'Token não fornecido',
                });
            }

            const token = authHeader.substring(7);
            const payload = authService.verifyToken(token);

            req.user = {
                userId: payload.userId,
                email: payload.email,
                permission: payload.permission,
            };

            next();
        } catch (error) {
            return res.status(401).json({
                message: 'Token inválido ou expirado',
            });
        }
    }

    requirePermissions() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    message: 'Usuário não autenticado',
                });
            }

            const routes = PERMISSIONS[user.permission].routes;
            if (routes === '*') return next();

            const hasAccess = (routes as readonly { path: string; methods: readonly string[] }[]).some(route => {
                const { regexp } = pathToRegexp(route.path);
                return regexp.test(req.path) && route.methods.includes(req.method);
            });

            if (!hasAccess) {
                return res.status(403).json({ 
                    message: 'Sem permissão' 
                });
            }

            next();
        };
    }

    requireOwnership(resourceGetter: (req: Request) => Promise<any>) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    message: 'Usuário não autenticado',
                });
            }

            if (user.permission === 'MASTER') return next();

            const resource = await resourceGetter(req);

            if (!resource) {
                return res.status(404).json({ 
                    message: 'Recurso não encontrado' 
                });
            }

            if (resource.userId !== user.userId) {
                return res.status(403).json({ 
                    message: 'Você não tem permissão para acessar este recurso' 
                });
            }

            next();
        };
    }
}

export default new AuthMiddleware();