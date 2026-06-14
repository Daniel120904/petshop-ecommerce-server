"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBirthday = void 0;
const zod_1 = require("zod");
const validateBirthday = (minAge) => zod_1.z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
    .refine((val) => {
    const [day, month, year] = val.split('-').map(Number);
    const birth = new Date(year, month - 1, day);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();
    const realAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
    return realAge >= minAge;
}, `Idade mínima é ${minAge} anos`);
exports.validateBirthday = validateBirthday;
