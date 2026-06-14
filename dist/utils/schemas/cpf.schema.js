"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCpf = void 0;
const zod_1 = require("zod");
const validateCpf = () => zod_1.z.string()
    .transform(val => val.replace(/\D/g, ''))
    .pipe(zod_1.z.string().length(11, 'CPF deve ter 11 dígitos'));
exports.validateCpf = validateCpf;
