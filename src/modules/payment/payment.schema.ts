import { z } from 'zod';
import { coerceId, toPascalCase } from '../../shared/schemas';
import { enumFromString, validatePagination } from '../../shared/schemas/common.schema';
import { card_brand } from '../../generated/prisma';

export const paymentSchema = {
    createCard: z.object({
        nickname: z.string().min(1, 'Apelido é obrigatório').transform(toPascalCase),
        holder: z.string().min(1, 'Titular é obrigatório').transform(toPascalCase),
        brand: enumFromString(card_brand),
        number: z.string()
            .transform(val => val.replace(/\D/g, ''))
            .pipe(z.string().length(16, 'Número do cartão inválido')),
    }),

    changePrimaryCard: z.object({
        cardId: coerceId('Cartão'),
    }),

    getCards: validatePagination(),

    deleteCard: z.object({
        cardId: coerceId('Cartão')
    })
};
