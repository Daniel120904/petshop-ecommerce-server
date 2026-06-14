"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanExpiredTokens = cleanExpiredTokens;
const active_token_repository_1 = __importDefault(require("../modules/auth/active-token.repository"));
async function cleanExpiredTokens() {
    try {
        const { count } = await active_token_repository_1.default.deleteMany({ expiresAt: { lt: new Date() } });
        console.log(`[TOKEN JOB] ${count} tokens expirados removidos`);
    }
    catch (error) {
        console.error('[TOKEN JOB] Erro ao limpar tokens:', error);
    }
}
