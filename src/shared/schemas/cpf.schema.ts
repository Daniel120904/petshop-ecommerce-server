import { z } from 'zod';

export const validateCpf = () => z.string()
    .transform(val => val.replace(/\D/g, ''))
    .pipe(z.string().length(11, 'CPF deve ter 11 dígitos'));