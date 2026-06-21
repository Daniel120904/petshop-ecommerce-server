import { z } from 'zod';
import { PaymentType, SaleStatus } from '@prisma/client';
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
        coupons: z.array(z.string()).optional(),
        addressId: coerceId('Endereco'),
        paymentType: enumFromString(PaymentType),
        cardId: coerceId('Cartao').optional(),
    }),

    updateStatus: z.object({
        saleId: coerceId('Venda'),
        status: enumFromString(SaleStatus)
    }),

    cancelSale: z.object({
        saleId: coerceId('Venda'),
        reason: z.string()
    }),

    getUserSales: z.object({
        userId: coerceId('Usuario')
    }),

    getSales: validatePagination(),

    checkFreight: z.object({
        addressId: coerceId('Endereço')
    })
};
