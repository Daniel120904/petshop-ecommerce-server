"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coupon_service_1 = __importDefault(require("./coupon.service"));
const coupon_repository_1 = __importDefault(require("./coupon.repository"));
class CouponController {
    async create(req, res) {
        const { type, discount, maxUses } = req.validated;
        const result = await coupon_service_1.default.create({
            discount,
            type,
            maxUses
        });
        return res.status(200).json({
            data: result
        });
    }
    async update(req, res) {
        const { type, discount, maxUses, couponId } = req.validated;
        const result = await coupon_service_1.default.update({
            value: discount !== undefined && type !== undefined
                ? {
                    discount,
                    type
                }
                : undefined,
            maxUses,
            couponId
        });
        return res.status(200).json({
            data: result
        });
    }
    async check(req, res) {
        const { code } = req.validated;
        const result = await coupon_service_1.default.check(code);
        return res.status(200).json({
            data: result
        });
    }
    async getCoupons(req, res) {
        const { orderBy, page, pageSize } = req.validated;
        const coupons = await coupon_repository_1.default.findMany({}, {
            include: {
                sales: true
            },
            pagination: {
                page,
                pageSize
            },
            orderBy
        });
        return res.status(200).json({
            data: coupons
        });
    }
    async active(req, res) {
        const { couponId, active } = req.validated;
        const result = await coupon_service_1.default.active({
            couponId,
            active
        });
        return res.status(200).json({
            data: result
        });
    }
}
exports.default = new CouponController();
