export enum PermissionLevel {
    PUBLIC = 'PUBLIC',
    USER = 'USER',
    MASTER = 'MASTER',
}

export const PERMISSIONS = {
    [PermissionLevel.PUBLIC]: {
        routes: [
            { path: '/auth/login', methods: ['POST'] },
            { path: '/auth/register', methods: ['POST'] },
            { path: '/auth/refresh', methods: ['POST'] },
        ],
    },
    [PermissionLevel.USER]: {
        routes: [
            { path: '/produtos', methods: ['GET'] },
            { path: '/produtos/:id', methods: ['GET'] },
            { path: '/pedidos', methods: ['GET', 'POST'] },
            { path: '/perfil', methods: ['GET', 'PUT'] },
        ],
    },
    [PermissionLevel.MASTER]: {
        routes: '*',
    },
} as const;