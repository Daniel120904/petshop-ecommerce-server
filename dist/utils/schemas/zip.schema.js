"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateZip = void 0;
const zod_1 = require("zod");
const validateZip = () => zod_1.z.string()
    .transform(val => val.replace(/\D/g, ''))
    .pipe(zod_1.z.string()
    .length(8, 'CEP deve ter 8 dígitos')
    .regex(/^\d{8}$/, 'CEP deve conter apenas números'));
exports.validateZip = validateZip;
