import { z } from 'zod';
import { CouponType } from '@prisma/client';
import { enumFromString, validatePagination } from '../../utils/schemas/common.schema';

export const couponSchema = {
    create: z.object({
        type: enumFromString(CouponType),
        discount: z.number().positive(),
        maxUses: z.number().positive().optional()
    }),

    list: validatePagination(),
    
    check: z.object({
        code: z.string()
    }),

    update: z.object({
        couponId: z.number(),
        type: enumFromString(CouponType).optional(),
        discount: z.number().positive().optional(),
        maxUses: z.number().positive().optional()
    }),

    active: z.object({
        couponId: z.number(),
        active: z.boolean()
    }),
};
