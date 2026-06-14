"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const sale_constants_1 = require("../../utils/constants/sale.constants");
const sale_helper_1 = require("../../utils/helpers/sale.helper");
const address_repository_1 = __importDefault(require("../address/address.repository"));
const coupon_service_1 = __importDefault(require("../coupon/coupon.service"));
const product_repository_1 = __importDefault(require("../product/product.repository"));
const sale_repository_1 = __importDefault(require("./sale.repository"));
class SaleService {
    async create(req) {
        const productIds = req.products.map(p => p.productId);
        const products = await product_repository_1.default.findMany({
            id: { in: productIds }
        });
        if (products.data.length !== productIds.length) {
            throw new Error('Produto não encontrado');
        }
        const address = await address_repository_1.default.findUnique({
            userId: req.userId,
            id: req.addressId
        });
        if (!address) {
            throw new Error('Endereço não encontrado');
        }
        let totalPrice = 0;
        for (const reqProduct of req.products) {
            const product = products.data.find(p => p.id === reqProduct.productId);
            totalPrice += product.price * reqProduct.quantity;
        }
        let discount = 0;
        if (req.coupons?.length) {
            for (const code of req.coupons) {
                const { coupon } = await coupon_service_1.default.check(code);
                if (!coupon) {
                    throw new Error(`${code}: Cupom inválido`);
                }
                if (coupon.type === 'percent') {
                    discount += totalPrice * (coupon.discount / 100);
                }
                if (coupon.type === 'value') {
                    discount += coupon.discount;
                }
            }
        }
        const finalPrice = Math.max(totalPrice - discount, 0);
        if (req.paymentType === 'card' && !req.cardId) {
            throw new Error('Cartão é obrigatório para pagamento com cartão');
        }
        const sale = await sale_repository_1.default.create({
            addressId: req.addressId,
            totalPrice,
            finalPrice,
            payment: {
                create: {
                    type: req.paymentType,
                    cardId: req.cardId,
                    amount: finalPrice,
                    status: 'pending'
                }
            },
            items: {
                create: req.products.map(p => {
                    const product = products.data.find(prod => prod.id === p.productId);
                    return {
                        productId: p.productId,
                        quantity: p.quantity,
                        price: product?.salePrice > 0 ? product.salePrice : product.price
                    };
                })
            },
            userId: req.userId,
        });
        return sale;
    }
    async updateStatus(req) {
        const sale = await sale_repository_1.default.findUnique({
            id: req.saleId
        }, {
            include: {
                payment: true,
                items: true
            }
        });
        if (!sale)
            throw new Error('Venda nao encontrada');
        const flowWithoutCancel = (0, sale_helper_1.removeTransitions)(sale_constants_1.BASE_STATUS_FLOW, [client_1.SaleStatus.canceled]);
        if (!flowWithoutCancel[sale.status].includes(req.status)) {
            throw new Error('Status inválido');
        }
        return await sale_repository_1.default.update({
            id: req.saleId
        }, {
            status: req.status
        });
    }
    async cancelSale(req) {
        const sale = await sale_repository_1.default.findUnique({
            id: req.saleId,
            userId: req.userId
        }, {
            include: {
                payment: true,
                items: true
            }
        });
        if (!sale)
            throw new Error('Venda nao encontrada');
        const flowWithoutCancel = (0, sale_helper_1.removeTransitions)(sale_constants_1.BASE_STATUS_FLOW, [client_1.SaleStatus.approved, client_1.SaleStatus.delivered, client_1.SaleStatus.processing, client_1.SaleStatus.shipped]);
        if (!flowWithoutCancel[sale.status].includes('canceled')) {
            throw new Error('Venda nao pode ser cancelada');
        }
        return await sale_repository_1.default.update({
            id: req.saleId
        }, {
            status: 'canceled',
            cancelReason: req.reason
        });
    }
}
exports.default = new SaleService();
