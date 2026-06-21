export enum PermissionLevel {
    PUBLIC = 'PUBLIC',
    USER = 'USER',
    MASTER = 'MASTER',
}

export const PERMISSIONS = {
    [PermissionLevel.PUBLIC]: {
        routes: [
            //Auth
            { path: '/login', methods: ['POST'] },
            { path: '/register', methods: ['POST'] },
            { path: '/refresh', methods: ['POST'] },

            //Produtos
            { path: '/product', methods: ['GET'] },
            { path: '/product/:productId', methods: ['GET'] },

            //Categoria
            { path: '/category', methods: ['GET'] },
            { path: '/subCategory', methods: ['GET'] },

            //ChatBot
            { path: '/chatBot', methods: ['POST'] },
        ],
    },
    [PermissionLevel.USER]: {
        routes: [
            //Auth
            { path: '/me', methods: ['GET'] },
            { path: '/logout', methods: ['POST'] },
            { path: '/user/me', methods: ['DELETE'] },
            { path: '/user', methods: ['PUT'] },
            { path: '/password', methods: ['PATCH'] },
            
            //Telefone
            { path: '/phone', methods: ['POST'] },
            { path: '/phone', methods: ['DELETE'] },
            { path: '/phone', methods: ['GET'] },

            //Endereco
            { path: '/address', methods: ['POST'] },
            { path: '/address', methods: ['DELETE'] },
            { path: '/address', methods: ['GET'] },
            { path: '/address', methods: ['PUT'] },

            //Cartao
            { path: '/card', methods: ['POST'] },
            { path: '/card/primary', methods: ['PATCH'] },
            { path: '/card', methods: ['GET'] },
            { path: '/card', methods: ['DELETE'] },

            //Produto

            //Carrinho
            { path: '/cart', methods: ['GET', 'PUT', 'POST', 'DELETE'] },

            //Cupons
            { path: '/coupon/check', methods: ['GET'] },

            //Vendas
            { path: '/sale', methods: ['POST', 'PATCH', 'GET'] },
            { path: '/sale/:userId', methods: ['GET'] },
            { path: '/sale/cancel', methods: ['PATCH'] },
            { path: '/freight/check', methods: ['GET'] },
        ],
    },
    [PermissionLevel.MASTER]: {
        routes: '*',
    },
} as const;