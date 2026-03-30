import { z } from 'zod';
import { coerceId, validatePhone } from '../../shared/schemas';
import { validatePagination } from '../../shared/schemas/common.schema';

export const phoneSchema = {
    create: validatePhone(),

    delete: z.object({
        phoneId: coerceId('Telefone')
    }),

    get: validatePagination()
};
