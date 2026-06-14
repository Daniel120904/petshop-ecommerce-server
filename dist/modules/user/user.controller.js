"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("./user.service"));
const user_repository_1 = __importDefault(require("./user.repository"));
const role_constants_1 = require("../../utils/constants/role.constants");
class UserController {
    async getUser(req, res) {
        const { userId } = req.validated;
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
                    number: phone.number,
                    ddd: phone.ddd
                })),
                addresses: user.addresses.map((address) => ({
                    nickname: address.nickname,
                    street: address.street,
                    number: address.number,
                    complement: address.complement,
                    neighborhood: address.neighborhood,
                    zip: address.zip,
                    city: address.city.name,
                    state: address.city.state.name,
                    abbreviation: address.city.state.abbreviation
                }))
            }
        });
    }
    async getUsers(req, res) {
        const { orderBy, page, pageSize } = req.validated;
        const result = await user_repository_1.default.findMany({
            role: {
                name: {
                    not: role_constants_1.RoleName.MASTER
                }
            }
        }, {
            pagination: {
                page,
                pageSize
            },
            orderBy,
            include: {
                authentication: true,
                gender: true,
                role: true
            }
        });
        return res.status(200).json({
            data: result.data.map(user => ({
                id: user.id,
                name: user.name,
                birthday: user.birthday,
                cpf: user.cpf,
                email: user.authentication?.email,
                active: user.authentication?.active,
                blocked: user.authentication?.blocked,
                gender: user.gender.name,
                role: user.role.name,
            })),
            meta: result.meta
        });
    }
    async delete(req, res) {
        const { userId } = req.validated;
        const result = await user_service_1.default.delete(Number(userId));
        return res.status(200).json({
            data: result,
        });
    }
    async deleteMe(req, res) {
        const { userId } = req.user;
        const result = await user_service_1.default.delete(userId);
        return res.status(200).json({
            data: result,
        });
    }
}
exports.default = new UserController();
