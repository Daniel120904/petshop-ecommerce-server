import { ValidatedRequest } from "../../utils/types/validate.types";
import { couponSchema } from "./coupon.schema";
import { Request, Response } from 'express';
import couponService from "./coupon.service";
import couponRepository from "./coupon.repository";


class CouponController {
    async create(req: ValidatedRequest<typeof couponSchema.create>, res: Response) {
        try {
            const { type, discount, maxUses } = req.validated;

            const result = await couponService.create({
                discount,
                type,
                maxUses
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

    async update(req: ValidatedRequest<typeof couponSchema.update>, res: Response) {
        try {
            const { type, discount, maxUses, couponId } = req.validated;

            const result = await couponService.update({
                value: discount !== undefined && type !== undefined
                    ? {
                        discount,
                        type
                    }
                    : undefined,
                maxUses,
                couponId
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

    async check(req: ValidatedRequest<typeof couponSchema.check>, res: Response) {
        try {
            const { code } = req.validated;

            const result = await couponService.check(code);

            return res.status(200).json({
                data: result
            })
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao criar usuário',
            });
        }
    }

    async getCoupons(req: ValidatedRequest<typeof couponSchema.list>, res: Response) {
        try {
            const { orderBy, page, pageSize } = req.validated;

            const coupons = await couponRepository.findMany(
                {
                    
                },
                {
                    include: {
                        sales: true
                    },
                    pagination: {
                        page,
                        pageSize
                    },
                    orderBy
                }
            )

            return res.status(200).json({
                data: coupons
            })
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Erro ao criar usuário',
            });
        }
    }

    async active(req: ValidatedRequest<typeof couponSchema.active>, res: Response) {
        try {
            const { couponId, active } = req.validated;

            const result = await couponService.active({
                couponId,
                active
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
}

export default new CouponController();