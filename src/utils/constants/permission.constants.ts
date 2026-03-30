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
            { path: '/me', methods: ['GET'] },
            { path: '/logout', methods: ['POST'] },
            { path: '/user/me', methods: ['DELETE'] },
            { path: '/user', methods: ['PUT'] },
            
            { path: '/phone', methods: ['POST'] },
            { path: '/phone', methods: ['DELETE'] },
            { path: '/phone', methods: ['GET'] },

            { path: '/address', methods: ['POST'] },
            { path: '/address', methods: ['DELETE'] },
            { path: '/address', methods: ['GET'] },
            { path: '/address', methods: ['PUT'] },

            { path: '/password', methods: ['PATCH'] },

            { path: '/card', methods: ['POST'] },
            { path: '/card/primary', methods: ['PATCH'] },
            { path: '/card', methods: ['GET'] },
            { path: '/card', methods: ['DELETE'] },
        ],
    },
    [PermissionLevel.MASTER]: {
        routes: '*',
    },
} as const;