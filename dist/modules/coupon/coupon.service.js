"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coupon_helper_1 = require("../../utils/helpers/coupon.helper");
const coupon_repository_1 = __importDefault(require("./coupon.repository"));
class CouponService {
    active(arg0) {
        throw new Error("Method not implemented.");
    }
    async create(req) {
        const code = await (0, coupon_helper_1.generateCouponCode)();
        if (req.discount <= 0)
            throw new Error('Desconto precisa ser maior que zero');
        if (req.type == 'value' && req.discount > 1)
            throw new Error('Desconto precisa ser menor que um');
        return await coupon_repository_1.default.create({
            discount: req.discount,
            code,
            type: req.type,
            maxUses: req.maxUses
        });
    }
    async check(code) {
        const coupon = await coupon_repository_1.default.findUnique({
            code,
        }, {
            include: {
                sales: true
            }
        });
        if (!coupon)
            return { status: false };
        if (coupon.maxUses >= coupon.sales.length)
            return { status: false };
        return {
            status: true,
            coupon
        };
    }
    async update(req) {
        const coupon = await coupon_repository_1.default.findUnique({
            id: req.couponId,
        }, {
            include: {
                sales: true
            }
        });
        if (!coupon)
            throw new Error('Cupom nao encontrado');
        if (req.value) {
            if (req.value.discount <= 0) {
                throw new Error('Desconto precisa ser maior que zero');
            }
            if (req.value.type === 'value' && req.value.discount > 1) {
                throw new Error('Desconto precisa ser menor que 1');
            }
        }
        return await coupon_repository_1.default.update({
            id: req.couponId
        }, {
            discount: req.value?.discount,
            maxUses: req.maxUses,
            type: req.value?.type
        });
    }
}
exports.default = new CouponService();
