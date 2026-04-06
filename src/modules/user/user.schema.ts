import { z } from 'zod';
import { coerceId } from '../../utils/schemas';
import { validatePagination } from '../../utils/schemas/common.schema';

export const userSchema = {
    delete: z.object({
        userId: coerceId('Usuario'),
    }),

    get: z.object({
        userId: coerceId('Usuario'),
    }),

    list: validatePagination()
};
