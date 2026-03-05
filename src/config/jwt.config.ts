import dotenv from 'dotenv';
import { StringValue } from 'ms';

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não definido no arquivo .env");
}

export const jwtConfig: {
    secret: string;
    accessTokenExpiration: StringValue;
    refreshTokenExpiration: StringValue;
    refreshTokenRememberMeExpiration: StringValue;
} = {
    secret: process.env.JWT_SECRET!,
    accessTokenExpiration: "1d",
    refreshTokenExpiration: "1d",
    refreshTokenRememberMeExpiration: "30d",
};