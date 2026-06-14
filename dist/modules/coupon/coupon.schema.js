"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const common_schema_1 = require("../../utils/schemas/common.schema");
exports.couponSchema = {
    create: zod_1.z.object({
        type: (0, common_schema_1.enumFromString)(client_1.CouponType),
        discount: zod_1.z.number().positive(),
        maxUses: zod_1.z.number().positive().optional()
    }),
    list: (0, common_schema_1.validatePagination)(),
    check: zod_1.z.object({
        code: zod_1.z.string()
    }),
    update: zod_1.z.object({
        couponId: zod_1.z.number(),
        type: (0, common_schema_1.enumFromString)(client_1.CouponType).optional(),
        discount: zod_1.z.number().positive().optional(),
        maxUses: zod_1.z.number().positive().optional()
    }),
    active: zod_1.z.object({
        couponId: zod_1.z.number(),
        active: zod_1.z.boolean()
    }),
};
