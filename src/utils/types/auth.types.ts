import { PermissionLevel } from "../constants/permission.constants";

export interface TokenPayload {
    userId: string;
    email: string;
    permission: PermissionLevel;
}

export interface LoginCredentials {
    email: string;
    password: string;
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
        id: string;
        email: string;
        username: string;
        permission: PermissionLevel;
    };
}
