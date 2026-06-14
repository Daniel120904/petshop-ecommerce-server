"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_repository_1 = __importDefault(require("./card.repository"));
const payment_service_1 = __importDefault(require("./payment.service"));
class PaymentController {
    async createCard(req, res) {
        const { nickname, holder, brand, number } = req.validated;
        const { userId } = req.user;
        const result = await payment_service_1.default.createCard(userId, {
            nickname,
            holder,
            brand,
            number
        });
        return res.status(200).json({
            data: result,
        });
    }
    async changePrimaryCard(req, res) {
        const { cardId } = req.validated;
        const { userId } = req.user;
        const result = await payment_service_1.default.setPrimaryCard(userId, cardId);
        return res.status(200).json({
            data: result,
        });
    }
    async deleteCard(req, res) {
        const { cardId } = req.validated;
        const { userId } = req.user;
        const result = await payment_service_1.default.deleteCard(userId, cardId);
        return res.status(200).json({
            data: result,
        });
    }
    async getCards(req, res) {
        const { orderBy, page, pageSize } = req.validated;
        const { userId } = req.user;
        const result = await card_repository_1.default.findMany({
            userId
        }, {
            pagination: {
                page,
                pageSize
            },
            orderBy
        });
        return res.status(200).json({
            data: result,
        });
    }
}
exports.default = new PaymentController();
