import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { jwtConfig } from '../../config/jwt.config';
import { TokenPayload, LoginCredentials } from '../../utils/types/auth.types';
import { includes } from 'zod';
import { PermissionLevel } from '../../utils/constants/permission.constants';

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
            const user = await prisma.user.findUnique({
                where: { email: credentials.email },
                includes: { role: true }
            });

            if (!user) throw new Error('Credenciais inválidas');
        
            const isPasswordValid = await this.comparePassword(credentials.password, user.password);

            if (!isPasswordValid) throw new Error('Credenciais inválidas');
       
            if (user.active === false) throw new Error('Usuário inativo');

            const permission = await this.resolvePermission(user.role?.name);

            const tokenPayload: TokenPayload = {
                userId: user.id,
                email: user.email,
                permission: permission,
            };

            const accessToken = this.generateAccessToken(tokenPayload);
            const refreshToken = this.generateRefreshToken(tokenPayload);

            await this.saveRefreshToken(user.id, refreshToken);

            return {
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    permission,
                },
            };
        } catch (error) {
            console.error('Erro no login:', error);
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

    async logout(userId: string): Promise<void> {
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

    private async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await prisma.refreshToken.create({
            data: {
                userId: userId,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
    }

    private async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
        const token = await prisma.refreshToken.findFirst({
            where: { 
                userId: userId, 
                token: refreshToken 
            },
        });

        if (!token) {
            return false;
        }

        if (new Date(token.expiresAt) < new Date()) {
            await prisma.refreshToken.delete({ where: { id: token.id } });
            return false;
        }

        return true;
    }

    private async invalidateRefreshToken(userId: string): Promise<void> {
        await prisma.refreshToken.deleteMany({
            where: { userId: userId },
        });
    }
}

export default new AuthService();