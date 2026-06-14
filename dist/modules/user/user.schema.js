"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../utils/schemas");
const common_schema_1 = require("../../utils/schemas/common.schema");
exports.userSchema = {
    delete: zod_1.z.object({
        userId: (0, schemas_1.coerceId)('Usuario'),
    }),
    get: zod_1.z.object({
        userId: (0, schemas_1.coerceId)('Usuario'),
    }),
    list: (0, common_schema_1.validatePagination)()
};
