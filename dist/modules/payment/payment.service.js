"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_repository_1 = __importDefault(require("./card.repository"));
class PaymentService {
    async createCard(userId, data) {
        const card = await card_repository_1.default.findFirst({
            userId,
            nickname: data.nickname
        });
        if (card)
            throw new Error("Apelido ja cadastrado");
        const last4 = data.number.slice(-4);
        const token = Math.random().toString(36).substring(2, 18); // 16 caracteres alfanuméricos
        return await card_repository_1.default.create({
            userId,
            nickname: data.nickname,
            holder: data.holder,
            brand: data.brand,
            last4,
            token
        });
    }
    async setPrimaryCard(userId, cardId) {
        const card = await card_repository_1.default.findUnique({
            id: cardId,
            userId
        });
        if (!card) {
            throw new Error('Cartão não encontrado');
        }
        await card_repository_1.default.updateMany({
            primary: true,
            userId,
            isDelete: false
        }, {
            primary: false
        });
        return await card_repository_1.default.update({
            id: card.id
        }, {
            primary: true
        });
    }
    async deleteCard(userId, cardId) {
        const card = await card_repository_1.default.findUnique({
            id: cardId,
            userId
        });
        if (!card) {
            throw new Error('Cartão não encontrado');
        }
        return await card_repository_1.default.delete({
            id: cardId
        });
    }
}
exports.default = new PaymentService();
