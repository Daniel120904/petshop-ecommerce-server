import { z } from 'zod';

export const validateBirthday = (minAge: number) => z.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, 'Data deve estar no formato DD-MM-YYYY')
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