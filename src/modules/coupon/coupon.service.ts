import { CouponType } from '@prisma/client';
import { generateCouponCode } from "../../utils/helpers/coupon.helper";
import couponRepository from "./coupon.repository";

class CouponService {
    active(arg0: { couponId: any; active: boolean; }) {
        throw new Error("Method not implemented.");
    }
    async create(req: {
        type: CouponType,
        discount: number,
        maxUses?: number
    }) {
        const code = await generateCouponCode();

        if(req.discount <= 0) throw new Error('Desconto precisa ser maior que zero');
        if(req.type == 'value' && req.discount > 1) throw new Error('Desconto precisa ser menor que um');

        return await couponRepository.create(
            {
                discount: req.discount,
                code,
                type: req.type,
                maxUses: req.maxUses
            }
        )
    }

    async check(code: string) {
        const coupon = await couponRepository.findUnique(
            {
                code,
            },
            {
                include: {
                    sales: true
                }
            }
        )

        if(!coupon) return { status: false };
        if(coupon.maxUses <= coupon.sales.length) return { status: false };

        return {
            status: true,
            coupon
        };
    }

    async update(req: {
        couponId: number,
        maxUses?: number,
        value?: {
            discount: number,
            type: CouponType
        }
    }) {
        const coupon = await couponRepository.findUnique(
            {
                id: req.couponId,
            },
            {
                include: {
                    sales: true
                }
            }
        )

        if(!coupon) throw new Error('Cupom nao encontrado');

        if (req.value) {
            if (req.value.discount <= 0) {
                throw new Error('Desconto precisa ser maior que zero');
            }

            if (req.value.type === 'value' && req.value.discount > 1) {
                throw new Error('Desconto precisa ser menor que 1');
            }
        }

        return await couponRepository.update(
            {
                id: req.couponId
            },
            {
                discount: req.value?.discount,
                maxUses: req.maxUses,
                type: req.value?.type
            }
        );
    }
}

export default new CouponService();