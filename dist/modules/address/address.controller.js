"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const address_service_1 = __importDefault(require("./address.service"));
const address_repository_1 = __importDefault(require("./address.repository"));
class AddressController {
    async create(req, res) {
        const { street, nickname, number, complement, neighborhood, zip, city, state } = req.validated;
        const { userId } = req.user;
        console.log(userId);
        const result = await address_service_1.default.create(userId, {
            street,
            nickname,
            number,
            complement,
            neighborhood,
            zip,
            city,
            state,
        });
        return res.status(200).json({
            data: result,
        });
    }
    async delete(req, res) {
        const { addressId } = req.validated;
        const { userId } = req.user;
        const result = await address_repository_1.default.delete({
            id: addressId,
            userId
        });
        return res.status(200).json({
            data: result,
        });
    }
    async edit(req, res) {
        const { addressId, street, nickname, number, complement, neighborhood, zip, city, state } = req.validated;
        const { userId } = req.user;
        const address = await address_repository_1.default.findUnique({
            userId,
            id: addressId
        });
        if (!address)
            throw new Error('Endereço não encontrado');
        const result = await address_service_1.default.edit(address.id, {
            street,
            nickname,
            number,
            complement,
            neighborhood,
            zip,
            city,
            state,
            userId
        });
        return res.status(200).json({
            data: result,
        });
    }
    async get(req, res) {
        const { page, pageSize, sort } = req.validated;
        const { userId } = req.user;
        const result = await address_repository_1.default.findMany({
            userId
        }, {
            orderBy: sort,
            pagination: {
                page,
                pageSize
            }
        });
        return res.status(200).json({
            data: result,
        });
    }
}
exports.default = new AddressController();
