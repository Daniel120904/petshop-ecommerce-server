import cron from 'node-cron';
import { cleanExpiredTokens } from './token.job';

export function startJobs() {
    // roda toda meia-noite
    cron.schedule('0 0 * * *', async () => {
        console.log('[JOBS] Rodando jobs diários...');
        await cleanExpiredTokens();
    });
}