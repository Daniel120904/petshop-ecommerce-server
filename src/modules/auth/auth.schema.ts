import { z } from 'zod';
import { validateCpf, validateBirthday, coerceId, validatePassword } from '../../shared/schemas';

export const authSchema = {
    login: z.object({
        email: z.string(),
        password: z.string(),
        rememberMe: z.preprocess(
            (val) => val === 'true' || val === true, 
            z.boolean().default(false)
        ),
    }),

    register: z.object({
        email: z.email('Email inválido'),
        password: validatePassword(),
        name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
        cpf: validateCpf(),
        birthday: validateBirthday(5),
        genderId: coerceId('Gênero'),
    }),

    refresh: z.object({
        refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
    }),
};
