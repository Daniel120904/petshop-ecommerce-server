"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const schemas_1 = require("../../utils/schemas");
const common_schema_1 = require("../../utils/schemas/common.schema");
exports.paymentSchema = {
    createCard: zod_1.z.object({
        nickname: zod_1.z.string().min(1, 'Apelido é obrigatório').transform(schemas_1.toPascalCase),
        holder: zod_1.z.string().min(1, 'Titular é obrigatório').transform(schemas_1.toPascalCase),
        brand: (0, common_schema_1.enumFromString)(client_1.CardBrand),
        number: zod_1.z.string()
            .transform(val => val.replace(/\D/g, ''))
            .pipe(zod_1.z.string().length(16, 'Número do cartão inválido')),
    }),
    changePrimaryCard: zod_1.z.object({
        cardId: (0, schemas_1.coerceId)('Cartão'),
    }),
    getCards: (0, common_schema_1.validatePagination)(),
    deleteCard: zod_1.z.object({
        cardId: (0, schemas_1.coerceId)('Cartão')
    })
};
