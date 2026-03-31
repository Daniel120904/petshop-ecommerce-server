import z from "zod";

export const cartItemSchema = z.object({
    productId: z.number(),
    quantity: z.number().int().min(0)
});