import { Request, Response } from 'express';
import phoneService from './phone.service';
import { getPhoneType } from '../../utils/helpers/phone.helper';
import phoneRepository from './phone.repository';
import { phoneSchema } from './phone.schema';
import { ValidatedRequest } from '../../utils/types/validate.types';

class PhoneController {
    async create(req: ValidatedRequest<typeof phoneSchema.create>, res: Response) {
        try {
            const { number, ddd } = req.validated;
            const { userId } = req.user!;

            const type = getPhoneType(number);

            const result = await phoneService.create(userId, number, type, ddd);

            return res.status(200).json({
                data: result,
            });
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao Adicionar Telefone',
            });
        }
    }

    async get(req: ValidatedRequest<typeof phoneSchema.get>, res: Response) {
        try {
            const { userId } = req.user!;

            const result = await phoneRepository.findMany(
                {
                    userId
                }
            );

            return res.status(200).json({
                data: result,
            });
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao Pegar Telefone',
            });
        }
    }

    async delete(req: ValidatedRequest<typeof phoneSchema.delete>, res: Response) {
        try {
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
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao Deletar Telefone',
            });
        }
    }
}

export default new PhoneController();