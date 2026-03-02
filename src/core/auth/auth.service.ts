import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { jwtConfig } from '../../config/jwt.config';
import { TokenPayload, LoginCredentials } from '../../utils/types/auth.types';
import { includes } from 'zod';
import { PermissionLevel } from '../../utils/constants/permission.constants';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

class AuthService {
    generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, jwtConfig.secret, {
            expiresIn: jwtConfig.accessTokenExpiration,
        });
    }

    generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(payload, jwtConfig.secret, {
            expiresIn: jwtConfig.refreshTokenExpiration,
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
            const auth = await prisma.authentication.findUnique({
                where: { email: credentials.email },
                include: {
                    user: {
                        include: { role: true }
                    }
                }
            });

            if (!auth) throw new Error('Credenciais inválidas');

            const isPasswordValid = await this.comparePassword(credentials.password, auth.password);
            if (!isPasswordValid) throw new Error('Credenciais inválidas');

            if (auth.active === false) throw new Error('Usuário inativo');
            if (auth.blocked === true) throw new Error('Usuário bloqueado');

            const permission = this.resolvePermission(auth.user.role?.name);

            const tokenPayload: TokenPayload = {
                userId: auth.user.id, 
                email: auth.email,
                permission,
            };

            const accessToken = this.generateAccessToken(tokenPayload);
            const refreshToken = this.generateRefreshToken(tokenPayload);

            await this.saveRefreshToken(auth.user.id, refreshToken);

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

            const newAccessToken = this.generateAccessToken(payload);

            return { accessToken: newAccessToken };
        } catch (error) {
            throw new Error('Não foi possível renovar o token');
        }
    }

    async logout(userId: number): Promise<void> {
        await this.invalidateRefreshToken(userId);
    }

    private resolvePermission(roleName?: string): PermissionLevel {
        if(!roleName) return PermissionLevel.PUBLIC;

        const map: Record<string, PermissionLevel> = {
            master: PermissionLevel.MASTER,
            user: PermissionLevel.USER
        }

        return map[roleName.toLowerCase()] ?? PermissionLevel.PUBLIC;
    }

    private async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
        await prisma.refresh_token.create({
            data: {
                userId: userId,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
    }

    private async validateRefreshToken(userId: number, refreshToken: string): Promise<boolean> {
        const token = await prisma.refresh_token.findFirst({
            where: { 
                userId: userId, 
                token: refreshToken 
            },
        });

        if (!token) {
            return false;
        }

        if (new Date(token.expiresAt) < new Date()) {
            await prisma.refresh_token.delete({ where: { id: token.id } });
            return false;
        }

        return true;
    }

    private async invalidateRefreshToken(userId: number): Promise<void> {
        await prisma.refresh_token.deleteMany({
            where: { userId: userId },
        });
    }
}

export default new AuthService();