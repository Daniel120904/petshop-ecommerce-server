"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const schemas_1 = require("../../utils/schemas");
const common_schema_1 = require("../../utils/schemas/common.schema");
exports.saleSchema = {
    createSale: zod_1.z.object({
        products: zod_1.z.array(zod_1.z.object({
            productId: (0, schemas_1.coerceId)('Produto'),
            quantity: zod_1.z.number().int().positive()
        })),
        coupons: zod_1.z.array(zod_1.z.string()).optional(),
        addressId: (0, schemas_1.coerceId)('Endereco'),
        paymentType: (0, common_schema_1.enumFromString)(client_1.PaymentType),
        cardId: (0, schemas_1.coerceId)('Cartao').optional(),
    }),
    updateStatus: zod_1.z.object({
        saleId: (0, schemas_1.coerceId)('Venda'),
        status: (0, common_schema_1.enumFromString)(client_1.SaleStatus)
    }),
    cancelSale: zod_1.z.object({
        saleId: (0, schemas_1.coerceId)('Venda'),
        reason: zod_1.z.string()
    }),
    getUserSales: zod_1.z.object({
        userId: (0, schemas_1.coerceId)('Usuario')
    }),
    getSales: (0, common_schema_1.validatePagination)()
};
