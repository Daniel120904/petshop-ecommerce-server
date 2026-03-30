
declare global {
    namespace Express {
        interface Request {
            validated: Record<string, any>
            user?: import('./auth.types').TokenPayload;
        }
    }
}

export {}