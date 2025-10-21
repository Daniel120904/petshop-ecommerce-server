import { CreateSaleInput } from "../dtos/saleDto";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export class SaleService {
    private readonly MOCK_USER_ID = 20;

    async createSale(input: CreateSaleInput) {
        const { addressId, couponCode, payments } = input

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
            totalValue = totalValue * (1 - coupon.discountPercentage / 100)
            couponId = coupon.id
        }

        const sale = await prisma.sale.create({
            data: {
                userId: this.MOCK_USER_ID,
                addressId,
                couponId,
                totalValue,
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
}