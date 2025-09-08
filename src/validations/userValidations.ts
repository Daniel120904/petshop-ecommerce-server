import { z } from "zod";

export const userValidations = {
    createUser: z.object({
        nome: z.string(),
        genero: z.enum(["Masculino", "Feminino", "Outro"]),
        dataNascimento: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "Data de nascimento inválida",
        }),
        cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
        email: z.string().email("Email inválido"),
        senha: z.string().refine((senha) =>
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(senha),
            {
                message: "Senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e caracteres especiais",
            }
        ),
        confirmarSenha: z.string(),
    }).refine((data) => data.senha === data.confirmarSenha, {
        message: "As senhas não coincidem",
        path: ["confirmarSenha"],
    }),

    createTelefone: z.object({
        tipo: z.enum(["Residencial", "Comercial", "Celular"]),
        ddd: z.string().length(2, "DDD deve ter 2 dígitos"),
        numero: z.string().min(8).max(9),
        userId: z.number().int(),
    }),

    createEndereco: z.object({
        nome: z.string(),
        tipoEndereco: z.enum(["Cobrança", "Entrega", "Cobrança e Entrega"]),
        tipoResidencia: z.enum(["Casa", "Apartamento", "Outro"]),
        tipoLogradouro: z.enum(["Rua", "Avenida", "Travessa"]),
        logradouro: z.string(),
        numero: z.string(),
        bairro: z.string(),
        cep: z.string().length(8, "CEP deve ter 8 dígitos"),
        cidade: z.string(),
        estado: z.string(),
        pais: z.string(),
        observacoes: z.string(),
        userId: z.number(),
    }),

    createCartao: z.object({
        numero: z.string().min(13).max(19),
        nome: z.string(),
        bandeira: z.enum(["Visa", "Mastercard"]),
        cvv: z.string().length(3),
        userId: z.number(),
    }),

    updateUser: z.object({
        userId: z.number(),
        nome: z.string(),
        genero: z.enum(["Masculino", "Feminino", "Outro"]),
        dataNascimento: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "Data de nascimento inválida",
        }),
        cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
        email: z.string().email("Email inválido"),
    }),

    updateTelefone: z.object({
        telefoneId: z.number().int(),
        tipo: z.enum(["Residencial", "Comercial", "Celular"]),
        ddd: z.string().length(2, "DDD deve ter 2 dígitos"),
        numero: z.string().min(8).max(9),
    }),

    updateSenha: z.object({
        userId: z.number(),
        senhaAtual: z.string(),
        novaSenha: z.string().refine((senha) =>
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(senha),
            {
                message: "Senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e caracteres especiais",
            }
        ),
        confirmarNovaSenha: z.string(),
    }).refine((data) => data.novaSenha === data.confirmarNovaSenha, {
        message: "As senhas não coincidem",
        path: ["confirmarNovaSenha"],
    }),

    updateEndereco: z.object({
        enderecoId: z.number(),
        nome: z.string(),
        tipoEndereco: z.enum(["Cobrança", "Entrega", "Cobrança e Entrega"]),
        tipoResidencia: z.enum(["Casa", "Apartamento", "Outro"]),
        tipoLogradouro: z.enum(["Rua", "Avenida", "Travessa"]),
        logradouro: z.string(),
        numero: z.string(),
        bairro: z.string(),
        cep: z.string().length(8, "CEP deve ter 8 dígitos"),
        cidade: z.string(),
        estado: z.string(),
        pais: z.string(),
        observacoes: z.string(),
    }),

    updateCartaoPreferencial: z.object({
        cartaoId: z.number(),
        preferencial: z.boolean(),
    }),

    updateStatusUser: z.object({
        userId: z.number(),
        status: z.boolean(),
    }),

};
