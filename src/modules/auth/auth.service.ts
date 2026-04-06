import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { jwtConfig } from '../../config/jwt.config';
import { TokenPayload, LoginCredentials } from '../../utils/types/auth.types';
import { PermissionLevel } from '../../utils/constants/permission.constants';
import ms from 'ms';
import authRepository from './auth.repository';
import refreshTokenRepository from './refresh-token.repository';
import activeTokenRepository from './active-token.repository';

const tokenBlacklist = new Set<string>();

class AuthService {
    generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, jwtConfig.secret, {
            expiresIn: jwtConfig.accessTokenExpiration as SignOptions["expiresIn"],
        });
    }

    private generateRefreshToken(payload: TokenPayload, rememberMe = false): string {
        return jwt.sign(payload, jwtConfig.secret, {
            expiresIn: rememberMe 
                ? jwtConfig.refreshTokenRememberMeExpiration 
                : jwtConfig.refreshTokenExpiration as SignOptions["expiresIn"],
        });
    }

    verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, jwtConfig.secret) as TokenPayload;
        } catch (error) {
            throw new Error('Token inválido ou expirado');
        }
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    async login(credentials: LoginCredentials): Promise<{ accessToken: string; refreshToken: string; user: any }> {
        try {
            const auth = await authRepository.findUnique(
                { 
                    email: credentials.email 
                },
                { 
                    include: { 
                        user: { 
                            include: { 
                                role: true 
                            } 
                        } 
                    } 
                }
            );

            if (!auth) throw new Error('Credenciais inválidas');

            const isPasswordValid = await this.comparePassword(credentials.password, auth.password);
            if (!isPasswordValid) throw new Error('Credenciais inválidas');

            if (auth.active === false) throw new Error('Usuário inativo');
            if (auth.blocked === true) throw new Error('Usuário bloqueado');

            const permission = this.resolvePermission(auth.user.role.name);

            const tokenPayload: TokenPayload = {
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
        } catch (error) {
            console.error('Erro no login: ', error);
            throw error;
        }
    }

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            const payload = this.verifyToken(refreshToken);

            const isValid = await this.validateRefreshToken(payload.userId, refreshToken);

            if (!isValid) {
                throw new Error('Refresh token inválido');
            }

            const { iat, exp, ...cleanPayload } = payload;

            const newAccessToken = this.generateAccessToken(cleanPayload);

            await activeTokenRepository.deleteMany({ userId: payload.userId });
            await this.saveActiveToken(payload.userId, newAccessToken);

            return { accessToken: newAccessToken };
        } catch (error) {
            console.error('ERRO DETALHADO:', error); 
            throw new Error('Não foi possível renovar o token');
        }
    }

    async logout(userId: number, refreshToken: string, accessToken: string): Promise<void> {
        await this.invalidateRefreshToken(userId, refreshToken);
        await activeTokenRepository.deleteMany({ token: accessToken }); 
    }

    async logoutAll(userId: number): Promise<void> {
        await this.invalidateAllRefreshTokens(userId);
        await activeTokenRepository.deleteMany({ userId });
    }

    private resolvePermission(roleName?: string): PermissionLevel {
        if (!roleName) return PermissionLevel.PUBLIC;

        const map: Record<string, PermissionLevel> = {
            master: PermissionLevel.MASTER,
            user: PermissionLevel.USER,
        };

        return map[roleName.toLowerCase()] ?? PermissionLevel.PUBLIC;
    }

    async isActiveToken(token: string): Promise<boolean> {
        const found = await activeTokenRepository.findFirst({ token });
        return !!found;
    }

    private async saveActiveToken(userId: number, token: string): Promise<void> {
        const payload = this.verifyToken(token);
        await activeTokenRepository.create({
            userId,
            token,
            expiresAt: new Date(payload.exp! * 1000),
        });
    }

    private async saveRefreshToken(userId: number, refreshToken: string, rememberMe = false): Promise<void> {
        await refreshTokenRepository.create({
            userId,
            token: refreshToken,
            expiresAt: new Date(Date.now() + ms(
                rememberMe
                    ? jwtConfig.refreshTokenRememberMeExpiration
                    : jwtConfig.refreshTokenExpiration
            )),
        });
    }

    private async validateRefreshToken(userId: number, refreshToken: string): Promise<boolean> {
        const token = await refreshTokenRepository.findFirst({ userId, token: refreshToken });

        if (!token) return false;

        if (new Date(token.expiresAt) < new Date()) {
            await refreshTokenRepository.deleteMany({ userId, token: refreshToken });
            return false;
        }

        return true;
    }

    private async invalidateRefreshToken(userId: number, refreshToken: string): Promise<void> {
        await refreshTokenRepository.deleteMany({ userId, token: refreshToken });
    }

    private async invalidateAllRefreshTokens(userId: number): Promise<void> {
        await refreshTokenRepository.deleteMany({ userId });
    }

    async updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
        const auth = await authRepository.findFirst({ userId });

        if (!auth) throw new Error('Usuário não encontrado');

        const isValid = await this.comparePassword(currentPassword, auth.password);
        if (!isValid) throw new Error('Senha atual incorreta');

        const hashed = await this.hashPassword(newPassword);

        await authRepository.update({ userId }, { password: hashed });
    }
}

export default new AuthService();