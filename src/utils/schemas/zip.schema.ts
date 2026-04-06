import { z } from 'zod';

export const validateZip = () =>
    z.string()
    .transform(val => val.replace(/\D/g, ''))
    .pipe(
        z.string()
            .length(8, 'CEP deve ter 8 dígitos')
            .regex(/^\d{8}$/, 'CEP deve conter apenas números')
    );