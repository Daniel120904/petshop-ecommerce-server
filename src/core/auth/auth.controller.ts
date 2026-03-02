import { Request, Response } from 'express';
import authService from './auth.service';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: 'Email e senha são obrigatórios',
                });
            }

            const result = await authService.login({ email, password });

            return res.status(200).json({
                data: result,
            });
        } catch (error: any) {
            return res.status(401).json({
                message: error.message || 'Erro ao fazer login',
            });
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    message: 'Refresh token é obrigatório',
                });
            }

            const result = await authService.refreshAccessToken(refreshToken);

            return res.status(200).json({
                data: result,
            });
        } catch (error: any) {
            return res.status(401).json({
                message: error.message || 'Erro ao renovar token',
            });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const user = (req as any).user;

            if (!user) {
                return res.status(401).json({
                    message: 'Usuário não autenticado',
                });
            }

            await authService.logout(user.userId);

            return res.status(200).json({
                message: 'Logout realizado com sucesso',
            });
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao fazer logout',
            });
        }
    }

    async me(req: Request, res: Response) {
        try {
            const user = (req as any).user;

            if (!user) {
                return res.status(401).json({
                    message: 'Usuário não autenticado',
                });
            }

            return res.status(200).json({
                data: user,
            });
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao buscar dados do usuário',
            });
        }
    }

    async register(req: Request, res: Response) {
        try {
            const { email, password, name, cpf, dataNascimento, genderId, roleId } = req.body;

            if (!email || !password || !name || !cpf || !dataNascimento || !genderId || !roleId) {
                return res.status(400).json({
                    message: 'Email, senha, nome, cpf, dataNascimento, genderId e roleId são obrigatórios',
                });
            }

            const existingAuth = await prisma.authentication.findUnique({
                where: { email },
            });

            if (existingAuth) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }

            const existingUser = await prisma.user.findUnique({
                where: { cpf },
            });

            if (existingUser) {
                return res.status(400).json({ message: 'CPF já cadastrado' });
            }

            const hashedPassword = await authService.hashPassword(password);

            const newUser = await prisma.user.create({
                data: {
                    name,
                    cpf,
                    dataNascimento: new Date(dataNascimento),
                    genderId,
                    roleId,
                    authentication: {
                        create: {
                            email,
                            password: hashedPassword,
                        },
                    },
                },
                include: { authentication: true },
            });

            return res.status(201).json({
                message: 'Usuário criado com sucesso',
                data: {
                    id: newUser.id,
                    email: newUser.authentication?.email,
                    name: newUser.name,
                },
            });
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao criar usuário',
            });
        }
    }
}

export default new AuthController();