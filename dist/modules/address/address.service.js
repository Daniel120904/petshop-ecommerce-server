"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const address_repository_1 = __importDefault(require("./address.repository"));
const city_repository_1 = __importDefault(require("./city.repository"));
const state_repository_1 = __importDefault(require("./state.repository"));
class AddressService {
    async create(userId, data) {
        const address = await address_repository_1.default.findFirst({
            userId,
            nickname: data.nickname
        });
        if (address)
            throw new Error("Apelido ja cadastrado");
        const state = await state_repository_1.default.findFirst({
            abbreviation: data.state,
        });
        if (!state)
            throw new Error(`Estado '${data.state}' não encontrado`);
        const city = await city_repository_1.default.upsert(data.city, state.id);
        return await address_repository_1.default.create({
            userId,
            nickname: data.nickname,
            street: data.street,
            number: data.number,
            complement: data.complement,
            neighborhood: data.neighborhood,
            zip: data.zip,
            cityId: city.id,
        });
    }
    async edit(addressId, data) {
        const address = await address_repository_1.default.findUnique({
            id: addressId
        }, {
            include: {
                city: true
            }
        });
        if (!address) {
            throw new Error('Endereço não encontrado');
        }
        const nicknameValidation = await address_repository_1.default.findFirst({
            userId: data.userId,
            nickname: data.nickname,
            id: { not: addressId }
        });
        if (nicknameValidation)
            throw new Error("Apelido ja cadastrado");
        let cityId = address.cityId;
        if (data.state || data.city) {
            const state = data.state
                ? await state_repository_1.default.findFirst({
                    abbreviation: data.state,
                })
                : null;
            if (data.state && !state) {
                throw new Error(`Estado '${data.state}' não encontrado`);
            }
            if (data.city) {
                const city = await city_repository_1.default.upsert(data.city, state?.id ?? address.city.stateId);
                cityId = city.id;
            }
        }
        return await address_repository_1.default.update({
            id: addressId
        }, {
            ...(data.nickname !== undefined && { nickname: data.nickname }),
            ...(data.street !== undefined && { street: data.street }),
            ...(data.number !== undefined && { number: data.number }),
            ...(data.complement !== undefined && { complement: data.complement }),
            ...(data.neighborhood !== undefined && { neighborhood: data.neighborhood }),
            ...(data.zip !== undefined && { zip: data.zip }),
            cityId,
        });
    }
}
exports.default = new AddressService();
