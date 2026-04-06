import { z } from 'zod';
import { payment_type, sale_status } from '../../generated/prisma';
import { coerceId } from '../../utils/schemas';
import { enumFromString, validatePagination } from '../../utils/schemas/common.schema';

export const saleSchema = {
    createSale: z.object({
        products: z.array(
            z.object({
                productId: coerceId('Produto'),
                quantity: z.number().int().positive()
            })
        ),
        coupons: z.array(z.string()),
        addressId: coerceId('Endereco'),
        paymentType: enumFromString(payment_type),
        cardId: coerceId('Cartao').optional(),
        userId: coerceId('Usuario')
    }),

    updateStatus: z.object({
        saleId: coerceId('Venda'),
        status: enumFromString(sale_status)
    }),

    cancelSale: z.object({
        saleId: coerceId('Venda'),
        reason: z.string()
    }),

    getUserSales: z.object({
        userId: coerceId('Usuario')
    }),

    getSales: validatePagination()
};
