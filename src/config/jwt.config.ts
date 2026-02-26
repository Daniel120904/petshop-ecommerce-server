import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

export const jwtConfig: {
  secret: string;
    accessTokenExpiration: SignOptions["expiresIn"];
    refreshTokenExpiration: SignOptions["expiresIn"];
} = {
    secret: process.env.JWT_SECRET!,
    accessTokenExpiration: "1d",
    refreshTokenExpiration: "7d",
};