import { z } from 'zod';
import { coupon_type } from '../../generated/prisma';
import { enumFromString, validatePagination } from '../../utils/schemas/common.schema';

export const couponSchema = {
    create: z.object({
        type: enumFromString(coupon_type),
        discount: z.number().positive(),
        maxUses: z.number().positive().optional()
    }),

    list: validatePagination(),
    
    check: z.object({
        code: z.string()
    }),

    update: z.object({
        couponId: z.number(),
        type: enumFromString(coupon_type).optional(),
        discount: z.number().positive().optional(),
        maxUses: z.number().positive().optional()
    }),

    active: z.object({
        couponId: z.number(),
        active: z.boolean()
    }),
};
