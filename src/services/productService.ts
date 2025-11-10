import { updateCartItens } from "../dtos/productDto";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export class ProductService {
    private readonly MOCK_USER_ID = 20;

    async getProducts() {
        return prisma.product.findMany({
            where: {quantity: {gt: 0}},
            select: {
                id: true,
                name: true,
                image: true,
                price: true
            }
        })
    }

    async getCartItems() {
        const cart = await prisma.cart.findUnique({
            where: { userId: this.MOCK_USER_ID },
        });

        if (!cart) {
            return [];
        }

        const items = await prisma.cartItem.findMany({
            where: { cartId: cart.id },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        image: true,
                    },
                },
            },
        });

        return items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            quantity: item.quantity,
        }));
    }

    async updateCartItens(data: updateCartItens) {
        const { item: productId, action } = data;

        let cart = await prisma.cart.findUnique({
            where: { userId: this.MOCK_USER_ID },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: this.MOCK_USER_ID },
            });
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId,
            },
        });

        if (action === "more") {
            if (!cartItem) {
                return await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId,
                        quantity: 1,
                    },
                });
            }

            return await prisma.cartItem.update({
                where: { id: cartItem.id },
                data: { quantity: cartItem.quantity + 1 },
            });
        }

        if (action === "less") {
            if (!cartItem) {
                throw new Error("Esse produto não está no carrinho");
            }

            if (cartItem.quantity > 1) {
                return await prisma.cartItem.update({
                    where: { id: cartItem.id },
                    data: { quantity: cartItem.quantity - 1 },
                });
            }

            return await prisma.cartItem.delete({
                where: { id: cartItem.id },
            });
        }
    }

    async getCategories() {
        return prisma.category.findMany({
            select: {
                id: true,
                name: true,
            }
        })
    }

}