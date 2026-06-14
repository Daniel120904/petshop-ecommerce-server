"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phone_service_1 = __importDefault(require("./phone.service"));
const phone_helper_1 = require("../../utils/helpers/phone.helper");
const phone_repository_1 = __importDefault(require("./phone.repository"));
class PhoneController {
    async create(req, res) {
        const { number, ddd } = req.validated;
        const { userId } = req.user;
        const type = (0, phone_helper_1.getPhoneType)(number);
        const result = await phone_service_1.default.create(userId, number, type, ddd);
        return res.status(200).json({
            data: result,
        });
    }
    async get(req, res) {
        const { userId } = req.user;
        const result = await phone_repository_1.default.findMany({
            userId
        });
        return res.status(200).json({
            data: result,
        });
    }
    async delete(req, res) {
        const { userId } = req.user;
        const { phoneId } = req.validated;
        const result = await phone_repository_1.default.delete({
            userId,
            id: phoneId
        });
        return res.status(200).json({
            data: result,
        });
    }
}
exports.default = new PhoneController();
