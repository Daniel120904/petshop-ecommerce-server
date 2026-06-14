"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const role_constants_1 = require("../../utils/constants/role.constants");
const auth_repository_1 = __importDefault(require("../auth/auth.repository"));
const auth_service_1 = __importDefault(require("../auth/auth.service"));
const user_repository_1 = __importDefault(require("./user.repository"));
class UserService {
    async delete(id) {
        const user = await user_repository_1.default.findUnique({
            id
        }, {
            include: {
                authentication: true,
                role: true
            }
        });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        if (user?.role.name == role_constants_1.RoleName.MASTER) {
            throw new Error('Não é possivel deletar um usuario master');
        }
        await auth_service_1.default.logoutAll(id);
        if (user?.authentication) {
            await auth_repository_1.default.delete({ id: user.authentication.id });
        }
        return await user_repository_1.default.delete({ id });
    }
    async getUser(id) {
        const user = await user_repository_1.default.findUnique({ id: id }, {
            include: {
                authentication: true,
                gender: true,
                role: true,
                phones: true,
                addresses: {
                    include: {
                        city: {
                            include: {
                                state: true
                            }
                        }
                    }
                },
                cards: true
            }
        });
        if (!user) {
            throw new Error("Usuário não encontrado");
        }
        return user;
    }
}
exports.default = new UserService();
