import { ValidatedRequest } from "../../utils/types/validate.types";
import cardRepository from "./card.repository";
import { paymentSchema } from "./payment.schema";
import paymentService from "./payment.service";
import { Request, Response } from 'express';

class PaymentController {
    async createCard(req: ValidatedRequest<typeof paymentSchema.createCard>, res: Response) {
        try {
            const { nickname, holder, brand, number } = req.validated;
            const { userId } = req.user!;

            const result = await paymentService.createCard(userId, {
                nickname,
                holder,
                brand,
                number
            });

            return res.status(200).json({
                data: result,
            });
        } catch (error: any) {
            return res.status(401).json({
                message: error.message || 'Erro ao fazer login',
            });
        }
    }

    async changePrimaryCard(req: ValidatedRequest<typeof paymentSchema.changePrimaryCard>, res: Response) {
        try {
            const { cardId } = req.validated;
            const { userId } = req.user!;

            const result = await paymentService.setPrimaryCard(userId, cardId);

            return res.status(200).json({
                data: result,
            });
        } catch (error: any) {
            return res.status(401).json({
                message: error.message || 'Erro ao fazer login',
            });
        }
    }

    async deleteCard(req: ValidatedRequest<typeof paymentSchema.deleteCard>, res: Response) {
        try {
            const { cardId } = req.validated;
            const { userId } = req.user!;

            const result = await paymentService.deleteCard(userId, cardId);

            return res.status(200).json({
                data: result,
            });
        } catch (error: any) {
            return res.status(401).json({
                message: error.message || 'Erro ao fazer login',
            });
        }
    }

    async getCards(req: ValidatedRequest<typeof paymentSchema.getCards>, res: Response) {
        try {
            const { orderBy, page, pageSize } = req.validated;
            const { userId } = req.user!;

            const result = await cardRepository.findMany(
                {
                    userId
                },
                {
                    pagination: {
                        page,
                        pageSize
                    },
                    orderBy
                }
            )

            return res.status(200).json({
                data: result,
            });
        } catch (error: any) {
            return res.status(401).json({
                message: error.message || 'Erro ao fazer login',
            });
        }
    }
}

export default new PaymentController();