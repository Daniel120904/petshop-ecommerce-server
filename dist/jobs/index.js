"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startJobs = startJobs;
const node_cron_1 = __importDefault(require("node-cron"));
const token_job_1 = require("./token.job");
function startJobs() {
    // roda toda meia-noite
    node_cron_1.default.schedule('0 0 * * *', async () => {
        console.log('[JOBS] Rodando jobs diários...');
        await (0, token_job_1.cleanExpiredTokens)();
    });
}
