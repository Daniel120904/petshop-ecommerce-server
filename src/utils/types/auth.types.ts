import { PermissionLevel } from "../constants/permission.constants";

export interface TokenPayload {
    userId: number;
    email: string;
    permission: PermissionLevel;
    iat?: number;
    exp?: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface RegisterData {
    email: string;
    password: string;
    username: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        email: string;
        username: string;
        permission: PermissionLevel;
    };
}
