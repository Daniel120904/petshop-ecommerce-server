import { z } from 'zod';

export const validatePhone = () =>
    z.object({
        ddd: z.string().length(2, "DDD deve ter 2 dígitos"),
        number: z.string().min(8).max(9),
    }).refine(({ ddd, number }) => {
        const full = ddd + number;
        return full.length >= 10 && full.length <= 11;
    }, {
        message: "Telefone deve ter 10 ou 11 dígitos",
    });
