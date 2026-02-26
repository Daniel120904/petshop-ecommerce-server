import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import authService from './auth.service';

const prisma = new PrismaClient();

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email e senha são obrigatórios',
                });
            }

            const result = await authService.login({ email, password });

            return res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            return res.status(401).json({
                success: false,
                message: error.message || 'Erro ao fazer login',
            });
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token é obrigatório',
                });
            }

            const result = await authService.refreshAccessToken(refreshToken);

            return res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            return res.status(401).json({
                success: false,
                message: error.message || 'Erro ao renovar token',
            });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const user = (req as any).user;

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuário não autenticado',
                });
            }

            await authService.logout(user.userId);

            return res.status(200).json({
                success: true,
                message: 'Logout realizado com sucesso',
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erro ao fazer logout',
            });
        }
    }

    async me(req: Request, res: Response) {
        try {
            const user = (req as any).user;

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuário não autenticado',
                });
            }

            return res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erro ao buscar dados do usuário',
            });
        }
    }

    async register(req: Request, res: Response) {
        try {
            const { email, password, name } = req.body;

            if (!email || !password || !name) {
                return res.status(400).json({
                    success: false,
                    message: 'Email, senha e nome são obrigatórios',
                });
            }

            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email já cadastrado',
                });
            }

            const hashedPassword = await authService.hashPassword(password);

            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    active: true,
                },
            });

            return res.status(201).json({
                success: true,
                message: 'Usuário criado com sucesso',
                data: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                },
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erro ao criar usuário',
            });
        }
    }
}

export default new AuthController();