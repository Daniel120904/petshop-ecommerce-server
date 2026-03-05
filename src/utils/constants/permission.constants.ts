export enum PermissionLevel {
    PUBLIC = 'PUBLIC',
    USER = 'USER',
    MASTER = 'MASTER',
}

export const PERMISSIONS = {
    [PermissionLevel.PUBLIC]: {
        routes: [
            { path: '/login', methods: ['POST'] },
            { path: '/register', methods: ['POST'] },
            { path: '/refresh', methods: ['POST'] },
        ],
    },
    [PermissionLevel.USER]: {
        routes: [
            { path: '/produtos', methods: ['GET'] },
            { path: '/produtos/:id', methods: ['GET'] },
            { path: '/pedidos', methods: ['GET', 'POST'] },
            { path: '/perfil', methods: ['GET', 'PUT'] },
            { path: '/me', methods: ['GET'] },
            { path: '/logout', methods: ['POST'] },
        ],
    },
    [PermissionLevel.MASTER]: {
        routes: '*',
    },
} as const;