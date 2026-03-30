import blacklistedTokenRepository from '../modules/auth/active-token.repository';

export async function cleanExpiredTokens() {
    try {
        const { count } = await blacklistedTokenRepository.deleteMany({ expiresAt: { lt: new Date() } });
        console.log(`[TOKEN JOB] ${count} tokens expirados removidos`);
    } catch (error) {
        console.error('[TOKEN JOB] Erro ao limpar tokens:', error);
    }
}