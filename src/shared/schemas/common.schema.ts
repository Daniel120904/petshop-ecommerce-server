import { z } from 'zod';
import { parseSortToOrderBy } from './sort.schema';
import { userSortMap } from '../../utils/constants/sortMap.constants';

export const coerceId = (fieldName: string) => z.preprocess((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    if (isNaN(Number(val))) return undefined;
    return Number(val);
}, z.number({ message: `${fieldName} é obrigatório` })
    .int(`${fieldName} deve ser um número inteiro`)
    .positive(`${fieldName} inválido`)
);

const lowerCaseWords = new Set([
    'da', 'de', 'do', 'das', 'dos', 'e', 'a', 'o', 'as', 'os',
    'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'com', 'sem',
    'um', 'uma', 'uns', 'umas',
]);

export const toPascalCase = (val: string) =>
    val
        .trim()
        .split(/\s+/)
        .map((word, index) => {
            const lower = word.toLowerCase();
            // primeira palavra sempre maiúscula
            if (index === 0) return lower.charAt(0).toUpperCase() + lower.slice(1);
            // palavras da lista ficam minúsculas
            if (lowerCaseWords.has(lower)) return lower;
            return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join(' ');


export const enumFromString = <T extends Record<string, string>>(enumObj: T) =>
    z.string().transform((val, ctx) => {
        const upper = val.toUpperCase();
        const values = Object.values(enumObj);

        if (!values.includes(upper)) {
            ctx.addIssue({
                code: "custom",
                message: `Valor inválido. Use: ${values.join(", ")}`,
            });
            
            return z.NEVER;
        }

    return upper as T[keyof T];
});

export const validatePagination = () =>
  z.object({
        page: z.coerce
        .number()
        .min(1, "page deve ser maior que 0")
        .optional(),

        pageSize: z.coerce
        .number()
        .min(1, "pageSize deve ser maior que 0")
        .optional(),

        sort: z
            .string()
            .optional()
            .transform((val) => {
                if (!val) return [{ createdAt: "desc" }];

                return parseSortToOrderBy(val, userSortMap);
            }),
    });
