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

        const result = await userRepository.findUnique(
            {
                id: userId
            }
        );

        return res.status(200).json({
            data: result,
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
                orderBy
            }
        );

        return res.status(200).json({
            data: result,
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