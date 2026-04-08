import { ValidatedRequest } from "../../utils/types/validate.types";
import { couponSchema } from "./coupon.schema";
import { Request, Response } from 'express';
import couponService from "./coupon.service";
import couponRepository from "./coupon.repository";


class CouponController {
    async create(req: ValidatedRequest<typeof couponSchema.create>, res: Response) {
        const { type, discount, maxUses } = req.validated;

        const result = await couponService.create({
            discount,
            type,
            maxUses
        });

        return res.status(200).json({
            data: result
        })
    }

    async update(req: ValidatedRequest<typeof couponSchema.update>, res: Response) {
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
    }

    async check(req: ValidatedRequest<typeof couponSchema.check>, res: Response) {
        const { code } = req.validated;

        const result = await couponService.check(code);

        return res.status(200).json({
            data: result
        })
    }

    async getCoupons(req: ValidatedRequest<typeof couponSchema.list>, res: Response) {
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
    }

    async active(req: ValidatedRequest<typeof couponSchema.active>, res: Response) {
        const { couponId, active } = req.validated;

        const result = await couponService.active({
            couponId,
            active
        });

        return res.status(200).json({
            data: result
        })
    }
}

export default new CouponController();