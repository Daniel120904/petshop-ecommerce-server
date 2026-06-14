"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("./auth.service"));
const role_constants_1 = require("../../utils/constants/role.constants");
const role_service_1 = __importDefault(require("../role/role.service"));
const user_repository_1 = __importDefault(require("../user/user.repository"));
const auth_repository_1 = __importDefault(require("./auth.repository"));
const gender_repository_1 = __importDefault(require("../user/gender.repository"));
const permission_constants_1 = require("../../utils/constants/permission.constants");
const user_service_1 = __importDefault(require("../user/user.service"));
class AuthController {
    async login(req, res) {
        const { email, password, rememberMe } = req.validated;
        const result = await auth_service_1.default.login({ email, password, rememberMe });
        return res.status(200).json({
            data: result,
        });
    }
    async refresh(req, res) {
        const { refreshToken } = req.validated;
        const result = await auth_service_1.default.refreshAccessToken(refreshToken);
        return res.status(200).json({
            data: result,
        });
    }
    async updatePassword(req, res) {
        const { currentPassword, newPassword } = req.validated;
        const { userId } = req.user;
        await auth_service_1.default.updatePassword(userId, currentPassword, newPassword);
        return res.status(200).json({ message: 'Senha atualizada com sucesso' });
    }
    async logout(req, res) {
        const { userId } = req.user;
        const { refreshToken } = req.validated;
        const accessToken = req.headers.authorization.substring(7);
        await auth_service_1.default.logout(userId, refreshToken, accessToken);
        return res.status(200).json({
            message: 'Logout realizado com sucesso',
        });
    }
    async me(req, res) {
        const { userId } = req.user;
        const user = await user_service_1.default.getUser(userId);
        return res.status(200).json({
            data: {
                id: user.id,
                name: user.name,
                birthday: user.birthday,
                cpf: user.cpf,
                gender: user.gender.name,
                role: user.role.name,
                email: user.authentication?.email,
                active: user.authentication?.active,
                blocked: user.authentication?.blocked,
                phones: user.phones.map((phone) => ({
                    phoneId: phone.id,
                    number: phone.number,
                    ddd: phone.ddd
                })),
                addresses: user.addresses.map((address) => ({
                    adressId: address.id,
                    nickname: address.nickname,
                    street: address.street,
                    number: address.number,
                    complement: address.complement,
                    neighborhood: address.neighborhood,
                    zip: address.zip,
                    city: address.city.name,
                    state: address.city.state.name,
                    abbreviation: address.city.state.abbreviation
                })),
                cards: user.cards.map((card) => ({
                    cardId: card.id,
                    last4: card.last4,
                    nickname: card.nickname
                }))
            },
        });
    }
    async register(req, res) {
        const { email, password, name, cpf, birthday, genderId } = req.validated;
        const existingAuth = await auth_repository_1.default.findFirst({
            email: { equals: email, mode: 'insensitive' },
        });
        if (existingAuth) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }
        const existingUser = await user_repository_1.default.findFirst({
            cpf,
        });
        if (existingUser) {
            return res.status(400).json({ message: 'CPF já cadastrado' });
        }
        const gender = await gender_repository_1.default.findUnique({
            id: genderId,
        });
        if (!gender) {
            return res.status(400).json({ message: 'Genero nao encontrado' });
        }
        const hashedPassword = await auth_service_1.default.hashPassword(password);
        const role = await role_service_1.default.getRole(role_constants_1.RoleName.USER);
        const newUser = await user_repository_1.default.create({
            name,
            cpf,
            birthday: new Date(birthday),
            genderId,
            roleId: role.id,
            authentication: {
                create: {
                    email,
                    password: hashedPassword,
                },
            },
        }, {
            include: {
                authentication: true
            }
        });
        return res.status(201).json({
            message: 'Usuário criado com sucesso',
            data: {
                id: newUser.id,
                email: newUser.authentication?.email,
                name: newUser.name,
                permission: permission_constants_1.PermissionLevel.USER,
                role: {
                    id: role.id,
                    name: role.name
                }
            },
        });
    }
    async blockUser(req, res) {
        const { blocked, userId } = req.validated;
        const user = await user_repository_1.default.findUnique({
            id: userId
        }, {
            include: {
                role: true
            }
        });
        if (!user)
            throw new Error('Usuário não encontrado');
        if (user.role.name == role_constants_1.RoleName.MASTER) {
            throw new Error('Não é possível bloquear/desativar um usuário master');
        }
        await auth_repository_1.default.update({ userId }, { blocked });
        return res.status(200).json({ data: { userId, blocked } });
    }
    async activeUser(req, res) {
        const { active, userId } = req.validated;
        const user = await user_repository_1.default.findUnique({
            id: userId
        }, {
            include: {
                role: true
            }
        });
        if (!user)
            throw new Error('Usuário não encontrado');
        if (user.role.name == role_constants_1.RoleName.MASTER) {
            throw new Error('Não é possível bloquear/desativar um usuário master');
        }
        await auth_repository_1.default.update({ userId }, { active });
        return res.status(200).json({ data: { userId, active } });
    }
    async updateUser(req, res) {
        const { userId, permission } = req.user;
        const { email, name, cpf, birthday, genderId } = req.validated;
        let targetUserId = userId;
        if (permission === permission_constants_1.PermissionLevel.MASTER) {
            const { userId: userChanged } = req.validated;
            if (!userChanged) {
                return res.status(400).json({
                    message: "Id do usuário não informado"
                });
            }
            targetUserId = userChanged;
        }
        const existingUser = await user_repository_1.default.findUnique({ id: targetUserId });
        if (!existingUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        if (email) {
            const existingAuth = await auth_repository_1.default.findFirst({
                email: { equals: email, mode: 'insensitive' },
                NOT: { userId },
            });
            if (existingAuth) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }
        }
        if (cpf) {
            const existingCpf = await user_repository_1.default.findFirst({
                cpf,
                NOT: { id: userId },
            });
            if (existingCpf) {
                return res.status(400).json({ message: 'CPF já cadastrado' });
            }
        }
        if (genderId) {
            const gender = await gender_repository_1.default.findUnique({ id: genderId });
            if (!gender) {
                return res.status(400).json({ message: 'Genero nao encontrado' });
            }
        }
        const updatedUser = await user_repository_1.default.update({ id: targetUserId }, {
            ...(name && { name }),
            ...(cpf && { cpf }),
            ...(birthday && { birthday: new Date(birthday) }),
            ...(genderId && { genderId }),
        }, { include: { authentication: true } });
        return res.status(200).json({
            message: 'Usuário atualizado com sucesso',
            data: {
                id: updatedUser.id,
                email: updatedUser.authentication?.email,
                name: updatedUser.name,
            },
        });
    }
}
exports.default = new AuthController();
