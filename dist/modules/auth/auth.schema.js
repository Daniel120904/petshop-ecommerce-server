"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../utils/schemas");
exports.authSchema = {
    login: zod_1.z.object({
        email: zod_1.z.string(),
        password: zod_1.z.string(),
        rememberMe: zod_1.z.preprocess((val) => val === 'true' || val === true, zod_1.z.boolean().default(false)),
    }),
    register: zod_1.z.object({
        email: zod_1.z.email('Email inválido'),
        password: (0, schemas_1.validatePassword)(),
        name: zod_1.z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').transform(schemas_1.toPascalCase),
        cpf: (0, schemas_1.validateCpf)(),
        birthday: (0, schemas_1.validateBirthday)(5),
        genderId: (0, schemas_1.coerceId)('Gênero'),
    }),
    refresh: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, 'Refresh token é obrigatório'),
    }),
    updatePassword: zod_1.z.object({
        currentPassword: zod_1.z.string().min(1, 'Senha atual é obrigatória'),
        newPassword: (0, schemas_1.validatePassword)(),
    }),
    logout: zod_1.z.object({
        refreshToken: zod_1.z.string({ error: 'Refresh token não informado' }),
    }),
    blockUser: zod_1.z.object({
        userId: (0, schemas_1.coerceId)('Usuario'),
        blocked: zod_1.z.boolean({ error: 'Estado do usuário não especificado' }),
    }),
    activeUser: zod_1.z.object({
        userId: (0, schemas_1.coerceId)('Usuario'),
        active: zod_1.z.boolean({ error: 'Estado do usuário não especificado' }),
    }),
    updateUser: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(3, 'Nome deve ter no mínimo 3 caracteres')
            .transform(schemas_1.toPascalCase)
            .optional(),
        cpf: (0, schemas_1.validateCpf)().optional(),
        birthday: (0, schemas_1.validateBirthday)(5).optional(),
        genderId: (0, schemas_1.coerceId)('Gênero').optional(),
        email: zod_1.z.email('Email inválido').optional(),
        userId: (0, schemas_1.coerceId)('Usuario').optional()
    })
        .refine((data) => Object.values(data).some((v) => v !== undefined), {
        message: 'Informe ao menos um campo para atualizar',
    }),
};
