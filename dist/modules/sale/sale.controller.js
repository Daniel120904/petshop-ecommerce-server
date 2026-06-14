"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sale_service_1 = __importDefault(require("./sale.service"));
const sale_repository_1 = __importDefault(require("./sale.repository"));
const permission_constants_1 = require("../../utils/constants/permission.constants");
class SaleController {
    async createSale(req, res) {
        const { addressId, coupons, paymentType, products, cardId } = req.validated;
        const { userId } = req.user;
        const result = await sale_service_1.default.create({
            addressId,
            paymentType,
            products,
            userId,
            cardId,
            coupons
        });
        return res.status(200).json({
            data: result
        });
    }
    async updateSaleStatus(req, res) {
        const { saleId, status } = req.validated;
        const result = await sale_service_1.default.updateStatus({
            saleId,
            status
        });
        return res.status(200).json({
            data: result
        });
    }
    async cancelSale(req, res) {
        const { saleId, reason } = req.validated;
        const { userId } = req.user;
        const result = await sale_service_1.default.cancelSale({
            saleId,
            userId,
            reason
        });
        return res.status(200).json({
            data: result
        });
    }
    async getSales(req, res) {
        const { orderBy, page, pageSize } = req.validated;
        const { userId, permission } = req.user;
        const filters = {};
        if (permission === permission_constants_1.PermissionLevel.USER) {
            filters.userId = userId;
        }
        const result = await sale_repository_1.default.findMany(filters, {
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                payment: true
            },
            orderBy,
            pagination: {
                page,
                pageSize
            }
        });
        return res.status(200).json({
            data: result
        });
    }
    async getUserSales(req, res) {
        const { orderBy, page, pageSize } = req.validated;
        const { userId } = req.user;
        const result = await sale_repository_1.default.findMany({
            userId
        }, {
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                payment: true
            },
            orderBy,
            pagination: {
                page,
                pageSize
            }
        });
        return res.status(200).json({
            data: result
        });
    }
}
exports.default = new SaleController();
