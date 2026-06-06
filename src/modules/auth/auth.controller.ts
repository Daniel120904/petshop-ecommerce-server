import { Request, Response } from 'express';
import authService from './auth.service';
import { RoleName } from '../../utils/constants/role.constants';
import roleService from '../role/role.service';
import userRepository from '../user/user.repository';
import authRepository from './auth.repository';
import genderRepository from '../user/gender.repository';
import { ValidatedRequest } from '../../utils/types/validate.types';
import { authSchema } from './auth.schema';
import { PermissionLevel } from '../../utils/constants/permission.constants';
import userService from '../user/user.service';

class AuthController {
    async login(req: ValidatedRequest<typeof authSchema.login>, res: Response) {
        const { email, password, rememberMe } = req.validated;

        const result = await authService.login({ email, password, rememberMe });

        return res.status(200).json({
            data: result,
        });
    }

    async refresh(req: ValidatedRequest<typeof authSchema.refresh>, res: Response) {
        const { refreshToken } = req.validated;

        const result = await authService.refreshAccessToken(refreshToken);

        return res.status(200).json({
            data: result,
        });
    }

    async updatePassword(req: ValidatedRequest<typeof authSchema.updatePassword>, res: Response) {
        const { currentPassword, newPassword } = req.validated;
        const { userId } = req.user!;

        await authService.updatePassword(userId, currentPassword, newPassword);

        return res.status(200).json({ message: 'Senha atualizada com sucesso' });
    }

    async logout(req: ValidatedRequest<typeof authSchema.logout>, res: Response) {
        const { userId } = req.user!;
        const { refreshToken } = req.validated;
        const accessToken = req.headers.authorization!.substring(7);

        await authService.logout(userId, refreshToken, accessToken);

        return res.status(200).json({
            message: 'Logout realizado com sucesso',
        });
    }

    async me(req: Request, res: Response) {
        const { userId } = req.user!;

        const user = await userService.getUser(userId)

        return res.status(200).json({
            data: {
                id: user.id,
                name: user.name,
                birthday: user.birthday,
                cpf: user.cpf,
                gender: user.gender.name,
                role: user.role.name,
                email: user.authentication?.email,
                active: user.authentication?.active,
                blocked: user.authentication?.blocked,
                phones: user.phones.map((phone) => ({
                    phoneId: phone.id,
                    number: phone.number,
                    ddd: phone.ddd
                })),
                addresses: user.addresses.map((address) => ({
                    adressId: address.id,
                    nickname: address.nickname,
                    street: address.street,
                    number: address.number,
                    complement: address.complement,
                    neighborhood: address.neighborhood,
                    zip: address.zip,
                    city: address.city.name,
                    state: address.city.state.name,
                    abbreviation: address.city.state.abbreviation
                })),
                cards: user.cards.map((card) => ({
                    cardId: card.id,
                    last4: card.last4,
                    nickname: card.nickname
                }))
            },
        });
    }

    async register(req: ValidatedRequest<typeof authSchema.register>, res: Response) {
        const { email, password, name, cpf, birthday, genderId } = req.validated;

        const existingAuth = await authRepository.findFirst({
            email: { equals: email, mode: 'insensitive' },
        });

        if (existingAuth) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        const existingUser = await userRepository.findFirst(
            {
                cpf,
            }
        );

        if (existingUser) {
            return res.status(400).json({ message: 'CPF já cadastrado' });
        }

        const gender = await genderRepository.findUnique(
            {
                id: genderId,
            }
        );

        if (!gender) {
            return res.status(400).json({ message: 'Genero nao encontrado' });
        }

        const hashedPassword = await authService.hashPassword(password);

        const role = await roleService.getRole(RoleName.USER);

        const newUser = await userRepository.create(
            {
                name,
                cpf,
                birthday: new Date(birthday),
                genderId,
                roleId: role.id,
                authentication: {
                    create: {
                        email,
                        password: hashedPassword,
                    },
                },
            },
            { 
                include: { 
                    authentication: true 
                } 
            },
        );

        return res.status(201).json({
            message: 'Usuário criado com sucesso',
            data: {
                id: newUser.id,
                email: newUser.authentication?.email,
                name: newUser.name,
                permission: PermissionLevel.USER,
                role: {
                    id: role.id,
                    name: role.name
                }
            },
        });
    }

    async blockUser(req: ValidatedRequest<typeof authSchema.blockUser>, res: Response) {
        const { blocked, userId } = req.validated;

        const user = await userRepository.findUnique(
            { 
                id: userId 
            },
            { 
                include: {
                    role: true
                }
            }
        )

        if (!user) throw new Error('Usuário não encontrado')
        
        if (user.role.name == RoleName.MASTER) {
            throw new Error('Não é possível bloquear/desativar um usuário master')
        }

        await authRepository.update(
            { userId },
            { blocked }
        )

        return res.status(200).json({ data: { userId, blocked } });
    }

    async activeUser(req: ValidatedRequest<typeof authSchema.activeUser>, res: Response) {
        const { active, userId } = req.validated;

        const user = await userRepository.findUnique(
            { 
                id: userId 
            },
            { 
                include: {
                    role: true
                }
            }
        )

        if (!user) throw new Error('Usuário não encontrado')
        
        if (user.role.name == RoleName.MASTER) {
            throw new Error('Não é possível bloquear/desativar um usuário master')
        }

        await authRepository.update(
            { userId },
            { active }
        )

        return res.status(200).json({ data: { userId, active } });
    }

    async updateUser(req: ValidatedRequest<typeof authSchema.updateUser>, res: Response) {
        const { userId, permission } = req.user!;
        const { email, name, cpf, birthday, genderId } = req.validated;

        let targetUserId = userId;

        if (permission === PermissionLevel.MASTER) {
            const { userId: userChanged } = req.validated;

            if (!userChanged) {
                return res.status(400).json({
                    message: "Id do usuário não informado"
                });
            }

            targetUserId = userChanged;
        }
    
        const existingUser = await userRepository.findUnique({ id: targetUserId });

        if (!existingUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (email) {
            const existingAuth = await authRepository.findFirst({
                email: { equals: email, mode: 'insensitive' },
                NOT: { userId },
            });

            if (existingAuth) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }
        }

        if (cpf) {
            const existingCpf = await userRepository.findFirst({
                cpf,
                NOT: { id: userId },
            });

            if (existingCpf) {
                return res.status(400).json({ message: 'CPF já cadastrado' });
            }
        }

        if (genderId) {
            const gender = await genderRepository.findUnique({ id: genderId });

            if (!gender) {
                return res.status(400).json({ message: 'Genero nao encontrado' });
            }
        }

        const updatedUser = await userRepository.update(
            { id: targetUserId },
            {
                ...(name && { name }),
                ...(cpf && { cpf }),
                ...(birthday && { birthday: new Date(birthday) }),
                ...(genderId && { genderId }),
            },
            { include: { authentication: true } },
        );

        return res.status(200).json({
            message: 'Usuário atualizado com sucesso',
            data: {
                id: updatedUser.id,
                email: updatedUser.authentication?.email,
                name: updatedUser.name,
            },
        });
    }
}

export default new AuthController();