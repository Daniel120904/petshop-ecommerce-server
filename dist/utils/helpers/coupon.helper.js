"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCouponCode = generateCouponCode;
const coupon_repository_1 = __importDefault(require("../../modules/coupon/coupon.repository"));
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateRandomCode(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
async function generateCouponCode() {
    let length = 5;
    let attempts = 0;
    while (true) {
        const code = generateRandomCode(length);
        const exists = await coupon_repository_1.default.findUnique({
            code: code
        });
        if (!exists) {
            return code;
        }
        attempts++;
        if (attempts >= 5) {
            length++;
            attempts = 0;
        }
    }
}
