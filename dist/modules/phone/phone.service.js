"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phone_repository_1 = __importDefault(require("./phone.repository"));
class PhoneService {
    async create(userId, number, type, ddd) {
        return await phone_repository_1.default.create({
            userId,
            ddd,
            number,
            type
        });
    }
}
exports.default = new PhoneService();
