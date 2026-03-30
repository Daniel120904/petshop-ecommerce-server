import { Request, Response } from 'express';
import userService from './user.service';
import userRepository from './user.repository';
import { ValidatedRequest } from '../../utils/types/validate.types';
import { userSchema } from './user.schema';
import { PermissionLevel } from '../../utils/constants/permission.constants';
import { RoleName } from '../../utils/constants/role.constants';

class UserController {
    async getUser(req: ValidatedRequest<typeof userSchema.get>, res: Response) {
        try {
            const { userId } = req.validated;
            console.log("oi")
            const result = await userRepository.findUnique(
                {
                    id: userId
                }
            );
            console.log("oi")
            return res.status(200).json({
                data: result,
            });
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao deletar usuário',
            });
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            const result = await userRepository.findMany(
                {
                    role: {
                        name: {
                            not: RoleName.MASTER
                        }
                    }
                }
            );

            return res.status(200).json({
                data: result,
            });
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao deletar usuário',
            });
        }
    }

    async delete(req: ValidatedRequest<typeof userSchema.delete>, res: Response) {
        try {
            const { userId } = req.validated;

            const result = await userService.delete(Number(userId));

            return res.status(200).json({
                data: result,
            });
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao deletar usuário',
            });
        }
    }

    async deleteMe(req: Request, res: Response) {
        try {
            const { userId } = req.user!;

            const result = await userService.delete(userId);

            return res.status(200).json({
                data: result,
            });
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao deletar usuário',
            });
        }
    }
}

export default new UserController();