import { z } from 'zod';
import { validateCpf, validateBirthday, coerceId } from '../../shared/schemas';

export const authSchema = {
    login: z.object({
        email: z.email('Email inválido'),
        password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    }),

    register: z.object({
        email: z.email('Email inválido'),
        password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
        name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
        cpf: validateCpf(),
        birthday: validateBirthday(5),
        genderId: coerceId('Gênero'),
    }),

    refresh: z.object({
        refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
    }),
};
