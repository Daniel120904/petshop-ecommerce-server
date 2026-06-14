"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePhone = void 0;
const zod_1 = require("zod");
const validatePhone = () => zod_1.z.object({
    ddd: zod_1.z.string().length(2, "DDD deve ter 2 dígitos"),
    number: zod_1.z.string().min(8).max(9),
}).refine(({ ddd, number }) => {
    const full = ddd + number;
    return full.length >= 10 && full.length <= 11;
}, {
    message: "Telefone deve ter 10 ou 11 dígitos",
});
exports.validatePhone = validatePhone;
