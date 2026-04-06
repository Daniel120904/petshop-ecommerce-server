import { ValidatedRequest } from "../../utils/types/validate.types";
import { saleSchema } from "./sale.schema";
import { Request, Response } from 'express';
import saleService from "./sale.service";
import saleRepository from "./sale.repository";

class SaleController {
    async createSale(req: ValidatedRequest<typeof saleSchema.createSale>, res: Response) {
        try {
            const { addressId, coupons, paymentType, products, cardId, userId } = req.validated;

            const result = await saleService.create({
                addressId,
                paymentType,
                products,
                userId,
                cardId,
                coupons
            });

            return res.status(200).json({
                data: result
            })
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao criar usuário',
            });
        }
    }

    async updateSaleStatus(req: ValidatedRequest<typeof saleSchema.updateStatus>, res: Response) {
        try {
            const { saleId, status } = req.validated;
            const { userId } = req.user!; 

            const result = await saleService.updateStatus({
                saleId,
                status
            });

            return res.status(200).json({
                data: result
            })
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao criar usuário',
            });
        }
    }

    async cancelSale(req: ValidatedRequest<typeof saleSchema.cancelSale>, res: Response) {
        try {
            const { saleId, reason } = req.validated;
            const { userId } = req.user!; 

            const result = await saleService.cancelSale({
                saleId,
                userId,
                reason
            });

            return res.status(200).json({
                data: result
            })
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao criar usuário',
            });
        }
    }

    async getSales(req: ValidatedRequest<typeof saleSchema.getSales>, res: Response) {
        try {
            const { orderBy, page, pageSize } = req.validated;

            const result = await saleRepository.findMany(
                {

                },
                {
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        },
                        payment: true
                    },
                    orderBy,
                    pagination: {
                        page,
                        pageSize
                    }
                }
            )

            return res.status(200).json({
                data: result
            })
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao criar usuário',
            });
        }
    }

    async getUserSales(req: ValidatedRequest<typeof saleSchema.getUserSales>, res: Response) {
        try {
            const { orderBy, page, pageSize } = req.validated;
            const { userId } = req.user!;

            const result = await saleRepository.findMany(
                {
                    userId
                },
                {
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        },
                        payment: true
                    },
                    orderBy,
                    pagination: {
                        page,
                        pageSize
                    }
                }
            )

            return res.status(200).json({
                data: result
            })
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao criar usuário',
            });
        }
    }
}

export default new SaleController();