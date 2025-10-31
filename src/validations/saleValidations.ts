import { z } from "zod";

export const saleValidations = {
    getSales: z.object({
        dataStart: z.preprocess((val) => val ? new Date(val as string) : undefined, z.date().optional()),
        dataEnd: z.preprocess((val) => val ? new Date(val as string) : undefined, z.date().optional()),
    }),

    createSale: z.object({
        addressId: z.number(),
        couponCode: z.string().optional(),
        payments: z.array(
            z.object({
                cardId: z.number(),
                amount: z.number().positive(),
            })
        ).optional(),
    }),

    updateStatusSale: z.object({
        id: z.number(),
        status: z.enum(["processamento", "aprovada", "transito", "troca", "entregue"]),
    }),
}