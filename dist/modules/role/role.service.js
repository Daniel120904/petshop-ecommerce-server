"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const role_repository_1 = __importDefault(require("./role.repository"));
const prisma = new client_1.PrismaClient();
class RoleService {
    async getRole(roleName) {
        const role = await role_repository_1.default.findUnique({ name: roleName });
        if (!role)
            throw new Error('Role não encontrada');
        return role;
    }
}
exports.default = new RoleService();
