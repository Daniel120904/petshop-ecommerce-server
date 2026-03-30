import { z } from 'zod';
import { coerceId } from '../../shared/schemas';
import { validatePagination } from '../../shared/schemas/common.schema';

export const userSchema = {
    delete: z.object({
        userId: coerceId('Usuario'),
    }),

    get: z.object({
        userId: coerceId('Usuario'),
    }),

    list: z.object({
        pagination: validatePagination()
    }),
};
