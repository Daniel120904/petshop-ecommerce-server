"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../modules/auth/auth.service"));
const permission_constants_1 = require("../utils/constants/permission.constants");
const path_to_regexp_1 = require("path-to-regexp");
class AuthMiddleware {
    async authenticate(req, res, next) {
        console.log('req.path:', req.path);
        console.log('req.method:', req.method);
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                const publicRoutes = permission_constants_1.PERMISSIONS[permission_constants_1.PermissionLevel.PUBLIC].routes;
                const isPublic = publicRoutes.some(route => {
                    const { regexp } = (0, path_to_regexp_1.pathToRegexp)(route.path);
                    return regexp.test(req.path) && route.methods.includes(req.method);
                });
                if (isPublic)
                    return next();
                return res.status(401).json({
                    message: 'Token não fornecido',
                });
            }
            const token = authHeader.substring(7);
            if (!await auth_service_1.default.isActiveToken(token)) {
                return res.status(401).json({ message: 'Token inválido ou expirado' });
            }
            const payload = auth_service_1.default.verifyToken(token);
            req.user = {
                userId: payload.userId,
                email: payload.email,
                permission: payload.permission,
            };
            next();
        }
        catch (error) {
            return res.status(401).json({
                message: 'Token inválido ou expirado',
            });
        }
    }
    requirePermissions() {
        return async (req, res, next) => {
            const publicRoutes = permission_constants_1.PERMISSIONS[permission_constants_1.PermissionLevel.PUBLIC].routes;
            const isPublic = publicRoutes.some(route => {
                const { regexp } = (0, path_to_regexp_1.pathToRegexp)(route.path);
                return regexp.test(req.path) && route.methods.includes(req.method);
            });
            if (isPublic) {
                return next();
            }
            const user = req.user;
            if (!user) {
                return res.status(401).json({
                    message: 'Usuário não autenticado',
                });
            }
            const permission = permission_constants_1.PERMISSIONS[user.permission];
            if (typeof permission.routes === 'string')
                return next();
            const hasAccess = permission.routes.some(route => {
                const { regexp } = (0, path_to_regexp_1.pathToRegexp)(route.path);
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
    requireOwnership(resourceGetter) {
        return async (req, res, next) => {
            const user = req.user;
            if (!user) {
                return res.status(401).json({
                    message: 'Usuário não autenticado',
                });
            }
            if (user.permission === permission_constants_1.PermissionLevel.MASTER)
                return next();
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
exports.default = new AuthMiddleware();
