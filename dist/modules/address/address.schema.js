"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../utils/schemas");
const common_schema_1 = require("../../utils/schemas/common.schema");
exports.addressSchema = {
    create: zod_1.z.object({
        street: zod_1.z.string().min(1, 'Rua é obrigatória').transform(schemas_1.toPascalCase),
        nickname: zod_1.z.string().min(1, 'Apelido é obrigatória').transform(schemas_1.toPascalCase),
        number: zod_1.z.string().min(1, 'Número é obrigatório'),
        complement: zod_1.z.string().optional(),
        neighborhood: zod_1.z.string().min(1, 'Bairro é obrigatório').transform(schemas_1.toPascalCase),
        zip: (0, schemas_1.validateZip)(),
        city: zod_1.z.string().min(1, 'Cidade é obrigatória').transform(schemas_1.toPascalCase),
        state: zod_1.z.string().length(2, 'UF deve ter 2 caracteres').transform(val => val.toUpperCase()),
        observation: zod_1.z.string().optional(),
    }),
    edit: zod_1.z.object({
        addressId: (0, schemas_1.coerceId)('Endereço'),
        street: zod_1.z.string().min(1, 'Rua é obrigatória').transform(schemas_1.toPascalCase).optional(),
        nickname: zod_1.z.string().min(1, 'Apelido é obrigatória').transform(schemas_1.toPascalCase).optional(),
        number: zod_1.z.string().min(1, 'Número é obrigatório').optional(),
        complement: zod_1.z.string().optional().optional(),
        neighborhood: zod_1.z.string().min(1, 'Bairro é obrigatório').transform(schemas_1.toPascalCase).optional(),
        zip: (0, schemas_1.validateZip)().optional(),
        city: zod_1.z.string().min(1, 'Cidade é obrigatória').transform(schemas_1.toPascalCase).optional(),
        state: zod_1.z.string().length(2, 'UF deve ter 2 caracteres').transform(val => val.toUpperCase()).optional(),
    }),
    delete: zod_1.z.object({
        addressId: (0, schemas_1.coerceId)('Endereço'),
    }),
    get: (0, common_schema_1.validatePagination)()
};
