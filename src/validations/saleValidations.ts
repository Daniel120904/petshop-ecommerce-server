import { z } from "zod";

export const saleValidations = {
    getSales: z.object({
        dataStart: z.preprocess(
            (val) => {
                if (!val || val === "undefined" || val === "") return undefined;
                const d = new Date(val as string);
                return isNaN(d.getTime()) ? undefined : d;
            },
            z.date().optional()
        ),
        dataEnd: z.preprocess(
            (val) => {
                if (!val || val === "undefined" || val === "") return undefined;
                const d = new Date(val as string);
                return isNaN(d.getTime()) ? undefined : d;
            },
            z.date().optional()
        ),
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
        status: z.enum(["processamento", "aprovada", "reprovada", "transito", "emTroca", "trocaAutorizada", "entregue"]),
    }),
}