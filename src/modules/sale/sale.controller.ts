import { ValidatedRequest } from "../../utils/types/validate.types";
import { saleSchema } from "./sale.schema";
import { Request, Response } from 'express';
import saleService from "./sale.service";
import saleRepository from "./sale.repository";

class SaleController {
    async createSale(req: ValidatedRequest<typeof saleSchema.createSale>, res: Response) {
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
    }

    async updateSaleStatus(req: ValidatedRequest<typeof saleSchema.updateStatus>, res: Response) {
        const { saleId, status } = req.validated;

        const result = await saleService.updateStatus({
            saleId,
            status
        });

        return res.status(200).json({
            data: result
        })
    }

    async cancelSale(req: ValidatedRequest<typeof saleSchema.cancelSale>, res: Response) {
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
    }

    async getSales(req: ValidatedRequest<typeof saleSchema.getSales>, res: Response) {
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
    }

    async getUserSales(req: ValidatedRequest<typeof saleSchema.getUserSales>, res: Response) {
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
    }
}

export default new SaleController();