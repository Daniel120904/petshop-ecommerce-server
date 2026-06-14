"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_config_1 = require("../../config/jwt.config");
const permission_constants_1 = require("../../utils/constants/permission.constants");
const ms_1 = __importDefault(require("ms"));
const auth_repository_1 = __importDefault(require("./auth.repository"));
const refresh_token_repository_1 = __importDefault(require("./refresh-token.repository"));
const active_token_repository_1 = __importDefault(require("./active-token.repository"));
const tokenBlacklist = new Set();
class AuthService {
    generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, jwt_config_1.jwtConfig.secret, {
            expiresIn: jwt_config_1.jwtConfig.accessTokenExpiration,
        });
    }
    generateRefreshToken(payload, rememberMe = false) {
        return jsonwebtoken_1.default.sign(payload, jwt_config_1.jwtConfig.secret, {
            expiresIn: rememberMe
                ? jwt_config_1.jwtConfig.refreshTokenRememberMeExpiration
                : jwt_config_1.jwtConfig.refreshTokenExpiration,
        });
    }
    verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, jwt_config_1.jwtConfig.secret);
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt_1.default.hash(password, saltRounds);
    }
    async comparePassword(password, hashedPassword) {
        return await bcrypt_1.default.compare(password, hashedPassword);
    }
    async login(credentials) {
        const auth = await auth_repository_1.default.findUnique({
            email: credentials.email
        }, {
            include: {
                user: {
                    include: {
                        role: true
                    }
                }
            }
        });
        if (!auth)
            throw new Error('Credenciais inválidas');
        const isPasswordValid = await this.comparePassword(credentials.password, auth.password);
        if (!isPasswordValid)
            throw new Error('Credenciais inválidas');
        if (auth.active === false)
            throw new Error('Usuário inativo');
        if (auth.blocked === true)
            throw new Error('Usuário bloqueado');
        const permission = this.resolvePermission(auth.user.role.name);
        const tokenPayload = {
            userId: auth.user.id,
            email: auth.email,
            permission,
        };
        const accessToken = this.generateAccessToken(tokenPayload);
        const refreshToken = this.generateRefreshToken(tokenPayload, credentials.rememberMe);
        await this.saveRefreshToken(auth.user.id, refreshToken, credentials.rememberMe);
        await this.saveActiveToken(auth.user.id, accessToken);
        return {
            accessToken,
            refreshToken,
            user: {
                id: auth.user.id,
                email: auth.email,
                name: auth.user.name,
                permission,
            },
        };
    }
    async refreshAccessToken(refreshToken) {
        const payload = this.verifyToken(refreshToken);
        const isValid = await this.validateRefreshToken(payload.userId, refreshToken);
        if (!isValid) {
            throw new Error('Refresh token inválido');
        }
        const { iat, exp, ...cleanPayload } = payload;
        const newAccessToken = this.generateAccessToken(cleanPayload);
        await active_token_repository_1.default.deleteMany({ userId: payload.userId });
        await this.saveActiveToken(payload.userId, newAccessToken);
        return { accessToken: newAccessToken };
    }
    async logout(userId, refreshToken, accessToken) {
        await this.invalidateRefreshToken(userId, refreshToken);
        await active_token_repository_1.default.deleteMany({ token: accessToken });
    }
    async logoutAll(userId) {
        await this.invalidateAllRefreshTokens(userId);
        await active_token_repository_1.default.deleteMany({ userId });
    }
    resolvePermission(roleName) {
        if (!roleName)
            return permission_constants_1.PermissionLevel.PUBLIC;
        const map = {
            master: permission_constants_1.PermissionLevel.MASTER,
            user: permission_constants_1.PermissionLevel.USER,
        };
        return map[roleName.toLowerCase()] ?? permission_constants_1.PermissionLevel.PUBLIC;
    }
    async isActiveToken(token) {
        const found = await active_token_repository_1.default.findFirst({ token });
        return !!found;
    }
    async saveActiveToken(userId, token) {
        const payload = this.verifyToken(token);
        await active_token_repository_1.default.create({
            userId,
            token,
            expiresAt: new Date(payload.exp * 1000),
        });
    }
    async saveRefreshToken(userId, refreshToken, rememberMe = false) {
        await refresh_token_repository_1.default.create({
            userId,
            token: refreshToken,
            expiresAt: new Date(Date.now() + (0, ms_1.default)(rememberMe
                ? jwt_config_1.jwtConfig.refreshTokenRememberMeExpiration
                : jwt_config_1.jwtConfig.refreshTokenExpiration)),
        });
    }
    async validateRefreshToken(userId, refreshToken) {
        const token = await refresh_token_repository_1.default.findFirst({ userId, token: refreshToken });
        if (!token)
            return false;
        if (new Date(token.expiresAt) < new Date()) {
            await refresh_token_repository_1.default.deleteMany({ userId, token: refreshToken });
            return false;
        }
        return true;
    }
    async invalidateRefreshToken(userId, refreshToken) {
        await refresh_token_repository_1.default.deleteMany({ userId, token: refreshToken });
    }
    async invalidateAllRefreshTokens(userId) {
        await refresh_token_repository_1.default.deleteMany({ userId });
    }
    async updatePassword(userId, currentPassword, newPassword) {
        const auth = await auth_repository_1.default.findFirst({ userId });
        if (!auth)
            throw new Error('Usuário não encontrado');
        const isValid = await this.comparePassword(currentPassword, auth.password);
        if (!isValid)
            throw new Error('Senha atual incorreta');
        const hashed = await this.hashPassword(newPassword);
        await auth_repository_1.default.update({ userId }, { password: hashed });
    }
}
exports.default = new AuthService();
