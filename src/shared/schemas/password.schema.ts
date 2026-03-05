import { z } from 'zod';

export const validatePassword = () =>
    z.string()
        .min(6, "A senha deve ter no mínimo 6 caracteres")
        .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
        .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
        .regex(/[0-9]/, "Deve conter pelo menos um número")
        .regex(/[^A-Za-z0-9]/, "Deve conter pelo menos um caractere especial");