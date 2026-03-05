import { z } from 'zod';

export const coerceId = (fieldName: string) => z.preprocess((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    if (isNaN(Number(val))) return undefined;
    return Number(val);
}, z.number({ message: `${fieldName} é obrigatório` })
    .int(`${fieldName} deve ser um número inteiro`)
    .positive(`${fieldName} inválido`)
);