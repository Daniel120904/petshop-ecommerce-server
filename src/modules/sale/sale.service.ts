import { PaymentType, SaleStatus } from '@prisma/client';
import { BASE_STATUS_FLOW } from "../../utils/constants/sale.constants";
import { removeTransitions } from "../../utils/helpers/sale.helper";
import addressRepository from "../address/address.repository";
import couponService from "../coupon/coupon.service";
import productRepository from "../product/product.repository";
import saleRepository from "./sale.repository";
import { shippingService } from '../../infrastructure/melhor-envio/shippingService';
import cartRepository from '../product/cart.repository';
import { prisma } from '../../core/database/prisma.client';

class SaleService {
    async create(req: {
        userId: number,
        addressId: number,
        cardId?: number,
        coupon?: string,
        products: {
            productId: number,
            quantity: number
        }[],
        paymentType: PaymentType
    }) {
        const productIds = req.products.map(p => p.productId);

        const products = await productRepository.findMany(
            { 
                id: { in: productIds } 
            }
        );

        if(products.data.length !== productIds.length) {
            throw new Error('Produto não encontrado');
        }

        for (const requestedProduct of req.products) {
            const product = products.data.find(
                p => p.id === requestedProduct.productId
            );

            if (!product) {
                const error: any = new Error('Produto não encontrado');
                error.status = 409;

                throw error;
            }

            if (product.stock < requestedProduct.quantity) {
                const error: any = new Error(`Estoque insuficiente para o produto ${product.name}`);
                error.status = 409;

                throw error;
            }
        }

        const address = await addressRepository.findUnique(
            { 
                userId: req.userId,
                id: req.addressId 
            }
        );

        if(!address) {
            throw new Error('Endereço não encontrado');
        }

        const freight = await shippingService.getOptions(address.id)
 
        let totalPrice = 0;

        for(const reqProduct of req.products) {
            const product = products.data.find(p => p.id === reqProduct.productId)!;
            totalPrice += product.price * reqProduct.quantity;
        }

        let discount = 0;

        if(req.coupon) {
            const { coupon } = await couponService.check(req.coupon);
            if(!coupon) {
                throw new Error(`${req.coupon}: Cupom inválido`);
            }

            if(coupon.type === 'percent') {
                discount += totalPrice * (coupon.discount / 100);
            }

            if(coupon.type === 'value') {
                discount += coupon.discount;
            }
        }

        const finalPrice = Math.max(totalPrice - discount + freight, 0);

        if (req.paymentType === 'card' && !req.cardId) {
            throw new Error('Cartão é obrigatório para pagamento com cartão');
        }

        await prisma.$transaction(async (tx) => {
            const sale = await tx.sale.create({
                data: {
                    addressId: req.addressId,
                    totalPrice,
                    finalPrice,
                    freight,
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
                            const product = products.data.find(
                                prod => prod.id === p.productId
                            )!;

                            return {
                                productId: p.productId,
                                quantity: p.quantity,
                                price: product.salePrice > 0
                                    ? product.salePrice
                                    : product.price
                            };
                        })
                    },
                    userId: req.userId,
                }
            });

            for (const item of req.products) {
                await tx.product.update({
                    where: {
                        id: item.productId
                    },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                });
            }

            await tx.cart_item.deleteMany({
                where: {
                    userId: req.userId
                }
            });

            return sale;
        });
    }

    async updateStatus(req: {
        saleId: number,
        status: SaleStatus
    }) {
        const sale = await saleRepository.findUnique(
            {
                id: req.saleId
            },
            {
                include: {
                    payment: true,
                    items: true
                }
            }
        )

        if(!sale) throw new Error('Venda nao encontrada');

        return await saleRepository.update(
            {
                id: req.saleId
            },
            {
                status: req.status
            }
        )
    }

    async cancelSale(req: {
        saleId: number,
        userId: number,
        reason: string,
    }) {
        const sale = await saleRepository.findUnique(
            {
                id: req.saleId,
                userId: req.userId
            },
            {
                include: {
                    payment: true,
                    items: true
                }
            }
        )

        if(!sale) throw new Error('Venda nao encontrada');

        const flowWithoutCancel = removeTransitions(BASE_STATUS_FLOW, [SaleStatus.approved, SaleStatus.delivered, SaleStatus.processing, SaleStatus.shipped]);

        if (!flowWithoutCancel[sale.status].includes('canceled')) {
            throw new Error('Venda nao pode ser cancelada');
        }

        return await saleRepository.update(
            {
                id: req.saleId
            },
            {
                status: 'canceled',
                cancelReason: req.reason
            }
        )
    }


}

export default new SaleService();