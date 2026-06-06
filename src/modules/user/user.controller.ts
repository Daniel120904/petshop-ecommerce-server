import { Request, Response } from 'express';
import userService from './user.service';
import userRepository from './user.repository';
import { ValidatedRequest } from '../../utils/types/validate.types';
import { userSchema } from './user.schema';
import { PermissionLevel } from '../../utils/constants/permission.constants';
import { RoleName } from '../../utils/constants/role.constants';

class UserController {
    async getUser(req: ValidatedRequest<typeof userSchema.get>, res: Response) {
        const { userId } = req.validated;

        const user = await userRepository.findUnique(
            { id: userId },
            {
                include: {
                    authentication: true,
                    gender: true,
                    role: true,
                    phones: true,
                    addresses: {
                        include: {
                            city: {
                                include: {
                                    state: true
                                }
                            }
                        }
                    }
                }
            }
        );

        if (!user) {
            return res.status(404).json({
                message: "Usuário não encontrado"
            });
        }

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
                    number: phone.number,
                    ddd: phone.ddd
                })),
                addresses: user.addresses.map((address) => ({
                    nickname: address.nickname,
                    street: address.street,
                    number: address.number,
                    complement: address.complement,
                    neighborhood: address.neighborhood,
                    zip: address.zip,
                    city: address.city.name,
                    state: address.city.state.name,
                    abbreviation: address.city.state.abbreviation
                })) 
            }
        });
    }

    async getUsers(req: ValidatedRequest<typeof userSchema.list>, res: Response) {
        const { orderBy, page, pageSize } = req.validated;

        const result = await userRepository.findMany(
            {
                role: {
                    name: {
                        not: RoleName.MASTER
                    }
                }
            },
            {
                pagination: {
                    page,
                    pageSize
                },
                orderBy,
                include: {
                    authentication: true,
                    gender: true,
                    role: true
                }
            }        
        );

        return res.status(200).json({
            data: result.data.map(user => ({
                id: user.id,
                name: user.name,
                birthday: user.birthday,
                cpf: user.cpf,
                email: user.authentication?.email,
                active: user.authentication?.active,
                blocked: user.authentication?.blocked,
                gender: user.gender.name,
                role: user.role.name,
            })),
            meta: result.meta
        });
    }

    async delete(req: ValidatedRequest<typeof userSchema.delete>, res: Response) {
        const { userId } = req.validated;

        const result = await userService.delete(Number(userId));

        return res.status(200).json({
            data: result,
        });
    }

    async deleteMe(req: Request, res: Response) {
        const { userId } = req.user!;

        const result = await userService.delete(userId);

        return res.status(200).json({
            data: result,
        });
    }
}

export default new UserController();