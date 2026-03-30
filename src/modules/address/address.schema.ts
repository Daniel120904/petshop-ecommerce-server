import { coerce, z } from 'zod';
import { coerceId, toPascalCase, validateZip } from '../../shared/schemas';
import { validatePagination } from '../../shared/schemas/common.schema';

export const addressSchema = {
    create: z.object({
        street: z.string().min(1, 'Rua é obrigatória').transform(toPascalCase),
        nickname: z.string().min(1, 'Apelido é obrigatória').transform(toPascalCase),
        number: z.string().min(1, 'Número é obrigatório'),
        complement: z.string().optional(),
        neighborhood: z.string().min(1, 'Bairro é obrigatório').transform(toPascalCase),
        zip: validateZip(),
        city: z.string().min(1, 'Cidade é obrigatória').transform(toPascalCase),
        state: z.string().length(2, 'UF deve ter 2 caracteres').transform(val => val.toUpperCase()),
        observation: z.string().optional(),
    }),

    edit: z.object({
        addressId: coerceId('Endereço'),
        street: z.string().min(1, 'Rua é obrigatória').transform(toPascalCase).optional(),
        nickname: z.string().min(1, 'Apelido é obrigatória').transform(toPascalCase).optional(),
        number: z.string().min(1, 'Número é obrigatório').optional(),
        complement: z.string().optional().optional(),
        neighborhood: z.string().min(1, 'Bairro é obrigatório').transform(toPascalCase).optional(),
        zip: validateZip().optional(),
        city: z.string().min(1, 'Cidade é obrigatória').transform(toPascalCase).optional(),
        state: z.string().length(2, 'UF deve ter 2 caracteres').transform(val => val.toUpperCase()).optional(),
    }),

    delete: z.object({
        addressId: coerceId('Endereço'),
    }),

    get: validatePagination()
};
