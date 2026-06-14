"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePagination = exports.enumFromString = exports.toPascalCase = exports.coerceId = void 0;
const zod_1 = require("zod");
const sort_schema_1 = require("./sort.schema");
const sortMap_constants_1 = require("../../utils/constants/sortMap.constants");
const coerceId = (fieldName) => zod_1.z.preprocess((val) => {
    if (val === undefined || val === null || val === '')
        return undefined;
    if (isNaN(Number(val)))
        return val;
    return Number(val);
}, zod_1.z.number({
    message: `${fieldName} é obrigatório`
})
    .int(`${fieldName} deve ser um número inteiro`)
    .positive(`${fieldName} inválido`));
exports.coerceId = coerceId;
const lowerCaseWords = new Set([
    'da', 'de', 'do', 'das', 'dos', 'e', 'a', 'o', 'as', 'os',
    'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'com', 'sem',
    'um', 'uma', 'uns', 'umas',
]);
const toPascalCase = (val) => val
    .trim()
    .split(/\s+/)
    .map((word, index) => {
    const lower = word.toLowerCase();
    // primeira palavra sempre maiúscula
    if (index === 0)
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    // palavras da lista ficam minúsculas
    if (lowerCaseWords.has(lower))
        return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
})
    .join(' ');
exports.toPascalCase = toPascalCase;
const enumFromString = (enumObj) => zod_1.z.string().transform((val, ctx) => {
    const lower = val.toLowerCase();
    const values = Object.values(enumObj);
    const normalizedValues = values.map(v => String(v).toLowerCase());
    if (!normalizedValues.includes(lower)) {
        ctx.addIssue({
            code: "custom",
            message: `Valor inválido. Use: ${values.join(", ")}`,
        });
        return zod_1.z.NEVER;
    }
    return lower;
});
exports.enumFromString = enumFromString;
const optionalNumber = () => zod_1.z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), zod_1.z.number().min(1, "deve ser maior que 0").optional());
const validatePagination = () => zod_1.z.object({
    page: optionalNumber().default(1),
    pageSize: optionalNumber().default(10),
    orderBy: zod_1.z.string().optional().transform((val) => {
        if (!val)
            return [{ createdAt: "desc" }];
        return (0, sort_schema_1.parseSortToOrderBy)(val, sortMap_constants_1.userSortMap);
    }),
});
exports.validatePagination = validatePagination;
