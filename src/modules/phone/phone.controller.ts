import { Request, Response } from 'express';
import phoneService from './phone.service';
import { getPhoneType } from '../../utils/helpers/phone.helper';
import phoneRepository from './phone.repository';
import { phoneSchema } from './phone.schema';
import { ValidatedRequest } from '../../utils/types/validate.types';

class PhoneController {
    async create(req: ValidatedRequest<typeof phoneSchema.create>, res: Response) {
        const { number, ddd } = req.validated;
        const { userId } = req.user!;

        const type = getPhoneType(number);

        const result = await phoneService.create(userId, number, type, ddd);

        return res.status(200).json({
            data: result,
        });
    }

    async get(req: ValidatedRequest<typeof phoneSchema.get>, res: Response) {
        const { userId } = req.user!;

        const result = await phoneRepository.findMany(
            {
                userId
            }
        );

        return res.status(200).json({
            data: result,
        });
    }

    async delete(req: ValidatedRequest<typeof phoneSchema.delete>, res: Response) {
        const { userId } = req.user!;
        const { phoneId } = req.validated;

        const result = await phoneRepository.delete(
            {
                userId,
                id: phoneId
            }
        );

        return res.status(200).json({
            data: result,
        });
    }
}

export default new PhoneController();