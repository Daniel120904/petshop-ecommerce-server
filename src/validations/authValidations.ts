import { z } from 'zod';

export const authValidations = {
    login: z.object({
        email: z.string().email('Email inválido'),
        password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    }),

    register: z.object({
        email: z.string().email('Email inválido'),
        password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
        name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    }),

    refresh: z.object({
        refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
    }),
};