import { z } from 'zod';
import { validatePhone, coerceId } from '../../utils/schemas';
import { validatePagination } from '../../utils/schemas/common.schema';


export const phoneSchema = {
    create: validatePhone(),

    delete: z.object({
        phoneId: coerceId('Telefone')
    }),

    get: validatePagination()
};
