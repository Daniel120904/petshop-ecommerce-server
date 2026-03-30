import { z } from 'zod';
import { validateCpf, validateBirthday, coerceId, validatePassword, toPascalCase } from '../../shared/schemas';

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
        name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').transform(toPascalCase),
        cpf: validateCpf(),
        birthday: validateBirthday(5),
        genderId: coerceId('Gênero'),
    }),

    refresh: z.object({
        refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
    }),

    updatePassword: z.object({
        currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
        newPassword: validatePassword(),
    }),

    logout: z.object({
        refreshToken: z.string({ error: 'Refresh token não informado' }),
    }),

    blockUser: z.object({
        userId: coerceId('Usuario'),
        blocked: z.boolean({ error: 'Estado do usuário não especificado' }),
    }),

    activeUser: z.object({
        userId: coerceId('Usuario'),
        active: z.boolean({ error: 'Estado do usuário não especificado' }),
    }),

    updateUser: z.object({
        name: z
            .string()
            .min(3, 'Nome deve ter no mínimo 3 caracteres')
            .transform(toPascalCase)
            .optional(),
        cpf: validateCpf().optional(),
        birthday: validateBirthday(5).optional(),
        genderId: coerceId('Gênero').optional(),
        email: z.email('Email inválido').optional(),
    })
    .refine((data) => Object.values(data).some((v) => v !== undefined), {
        message: 'Informe ao menos um campo para atualizar',
    }),
};
