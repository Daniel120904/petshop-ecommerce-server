"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phoneSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../utils/schemas");
const common_schema_1 = require("../../utils/schemas/common.schema");
exports.phoneSchema = {
    create: (0, schemas_1.validatePhone)(),
    delete: zod_1.z.object({
        phoneId: (0, schemas_1.coerceId)('Telefone')
    }),
    get: (0, common_schema_1.validatePagination)()
};
