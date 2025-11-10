import { CreateSaleInput, GetSales, getSalesByCategory, updateStatusSale } from "../dtos/saleDto";
import { PrismaClient } from "../generated/prisma";
import { generateCouponCode } from "../utils/generateCuponCode";

const prisma = new PrismaClient();

export class SaleService {
    private readonly MOCK_USER_ID = 20;

    async createSale(req: CreateSaleInput) {
        const { addressId, couponCode, payments } = req

        const cart = await prisma.cart.findUnique({
            where: { userId: this.MOCK_USER_ID },
            include: { items: { include: { product: true } } },
        })

        if (!cart || cart.items.length === 0) {
            throw new Error('Carrinho vazio')
        }

        let totalValue = cart.items.reduce(
            (sum, item) => sum + item.quantity * item.product.price,
            0
        )

        let couponId: number | null = null
        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } })
            if (!coupon) throw new Error('Cupom inválido')
            if (!coupon.discountPercentage) throw new Error('Cupom inválido')
            totalValue = totalValue * (1 - coupon.discountPercentage / 100)
            couponId = coupon.id
        }

        const sale = await prisma.sale.create({
            data: {
                userId: this.MOCK_USER_ID,
                addressId,
                couponId,
                totalValue,
                status: "processamento",
                items: {
                    create: cart.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
                payments: payments?.length
                    ? {
                        create: payments.map(p => ({
                            cardId: p.cardId,
                            amount: p.amount,
                        })),
                    }
                    : undefined,
            },
            include: {
                items: { include: { product: true } },
                payments: true,
            },
        })
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })

        return sale
    }

    async getSalesUser() {
        const sales = await prisma.sale.findMany({
            where: { userId: this.MOCK_USER_ID },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                payments: {
                    include: {
                        card: true,
                    }
                },
                items: {
                    include: {
                        product: true
                    }
                },
            },
        })

        return sales
    }

    async getCupon(code: string) {
        const cupon = await prisma.coupon.findFirst({
            where: { code: { equals: code } }
        })

        return cupon
    }

    async getSales(req: GetSales) {
        const { dataStart, dataEnd } = req;

        const where: any = {};

        if (dataStart && dataEnd) {
            where.createdAt = {
                gte: new Date(dataStart),
                lte: new Date(dataEnd),
            };
        } else if (dataStart) {
            where.createdAt = {
                gte: new Date(dataStart),
            };
        } else if (dataEnd) {
            where.createdAt = {
                lte: new Date(dataEnd),
            };
        }

        const sales = await prisma.sale.findMany({
            where,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                user: { select: { nome: true } },
                createdAt: true,
                status: true,
            },
        });

        return sales;
    }

    async updateStatusSale(req: updateStatusSale) {
        const sale = await prisma.sale.findUnique({
            where: { id: req.id },
            include: {
                items: true
            }
        })

        if (!sale) {
            throw new Error("Venda não encontrada");
        }

        await prisma.sale.update({
            where: { id: req.id },
            data: {
                status: req.status
            }
        })

        if (req.status == "trocaAutorizada") {
            let discountValue = 0
            for (const item of sale.items) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        quantity: + item.quantity
                    },
                })
                discountValue += item.price
            }
            await prisma.coupon.create({
                data: {
                    discountValue: discountValue,
                    code: generateCouponCode()
                }
            })
        }

        return "Status atualizado"
    }

    async getSalesByCategory(req: getSalesByCategory) {
        const { dataStart, dataEnd, categoryId } = req;
        
        const where: any = {
            items: {
                some: {
                    product: {
                        categoryId: categoryId
                    }
                }
            }
        };

        if (dataStart && dataEnd) {
            where.createdAt = {
                gte: new Date(dataStart),
                lte: new Date(dataEnd),
            };
        } else if (dataStart) {
            where.createdAt = { gte: new Date(dataStart) };
        } else if (dataEnd) {
            where.createdAt = { lte: new Date(dataEnd) };
        }

        const sales = await prisma.sale.findMany({
            where,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                user: { select: { nome: true } },
                createdAt: true,
                status: true,
                items: {
                    select: {
                        quantity: true,
                        price: true,
                        product: {
                            select: {
                                name: true,
                                category: {
                                    select: { name: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        return sales;
    }

}