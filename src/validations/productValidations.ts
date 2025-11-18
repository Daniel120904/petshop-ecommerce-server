import { z } from "zod";

export const productValidations = {
    updateCartItens: z.object({
        action: z.enum(["more", "less"]),
        item: z.number().int(),
    }),

    getAiRecommendation: z.object({
        message: z.string()
    }),
}