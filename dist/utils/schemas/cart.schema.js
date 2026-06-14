"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartItemSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.cartItemSchema = zod_1.default.object({
    productId: zod_1.default.number(),
    quantity: zod_1.default.number().int().min(0)
});
