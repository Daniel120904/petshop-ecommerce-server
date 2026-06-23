import { validateSubCategories } from "../../utils/helpers/category.helper";
import cartRepository from "./cart.repository";
import productRepository from "./product.repository";
import productSubCategoryRepository from "./productSubCategory.repository";

class ProductService {
    async createProduct(req: {
        name: string,
        price: number,
        stock: number,
        images?: string[],
        categoryId: number,
        subCategoryIds: number[],
        description?: string
    }) {
        const subCategories = await validateSubCategories(req.categoryId, req.subCategoryIds);

        const product = await productRepository.findFirst(
            {
                name: req.name
            }
        )

        if(product) throw new Error("Já existe um produto com esse nome");

        return await productRepository.create(
            {
                name: req.name,
                price: req.price,
                stock: req.stock,
                description: req.description,
                subCategories: {
                    create: subCategories.map((sub) => ({
                        subCategoryId: sub.id
                    }))
                }
            }
        )
    }

    async activeProduct(productId: number, active: boolean) {
        return await productRepository.update(
            {
                id: productId,
            },
            {
                active: active
            }
        );
    }

    async deleteProduct(productId: number) {
        return await productRepository.delete(
            {
                id: productId
            }
        );
    }

    async editProduct(req: {
        productId: number,
        name?: string,
        price?: number,
        stock?: number,
        images?: string[],
        description?: string,
        category?: {
            categoryId: number,
            subCategoryIds: number[]
        }
    }) {
        let subCategories;
        if(req.category) {
            subCategories = await validateSubCategories(req.category.categoryId, req.category.subCategoryIds);

            await productSubCategoryRepository.deleteMany(
                {
                    productId: req.productId
                }
            );
        }

        if(req.name) {
            const product = await productRepository.findFirst(
                {
                    name: req.name,
                    id: { not: req.productId }
                }
            )

            if(product) throw new Error("Nome ja Cadastrado");
        }

        return await productRepository.update(
            {
                id: req.productId
            },
            {
                name: req.name,
                price: req.price,
                stock: req.stock,
                description: req.description,
                images: req.images,
                ...(subCategories && {
                        subCategories: {
                            create: subCategories.map((sub) => ({
                                subCategoryId: sub.id
                            }))
                        }
                    }
                )
            }
        );
    }

    async addCart(req: {
        userId: number,
        productId: number,
        quantity: number
    }) {
        const product = await productRepository.findUnique(
            {
                active: true,
                id: req.productId
            },
            {
                include: {
                    cartItems: true
                }
            }
        );
    
        if(!product) throw new Error("Produto nao disponivel");

        const cartItem = product.cartItems.find(
            item => item.userId === req.userId
        );

        const currentQuantity = cartItem?.quantity ?? 0;

        if(product.stock - currentQuantity - req.quantity < 0){
            const error: any = new Error(`Estoque insuficiente`);
            error.status = 409;

            throw error;
        }

        if(cartItem) {
            let quantity = req.quantity + product.cartItems?.[0]?.quantity;

            return await cartRepository.update(
                {
                    userId_productId: {
                        productId: req.productId,
                        userId: req.userId,
                    }
                },
                {
                    quantity
                }
            )
        }

        return await cartRepository.create(
            {
                productId: req.productId,
                userId: req.userId,
                quantity: req.quantity
            }
        )
    }

    async removeCart(req: {
        userId: number,
        productId: number
    }) {
        return await cartRepository.delete({
            userId_productId: {
                productId: req.productId,
                userId: req.userId
            }
        })
    }

    async updateCart(
        userId: number,
        items: {
            productId: number,
            quantity: number
        }[]
    ) {
        const cart = await cartRepository.findMany({ userId });
        if (!cart.data.length) throw new Error("Carrinho não encontrado");

        const cartData = cart.data;

        const existingProductIds = cartData.map(i => i.productId);

        const toRemove = items.filter(i => i.quantity === 0);

        const toUpdate = items.filter(i =>
            i.quantity > 0 && existingProductIds.includes(i.productId)
        );

        const toAdd = items.filter(i =>
            i.quantity > 0 && !existingProductIds.includes(i.productId)
        );

        await Promise.all([
            ...toRemove.map(i =>
                cartRepository.delete({
                    userId_productId: {
                        productId: i.productId,
                        userId
                    }
                })
            ),
            ...toUpdate.map(i =>
                cartRepository.update(
                    {
                        userId_productId: {
                            productId: i.productId,
                            userId
                        }
                    },
                    {
                        quantity: i.quantity
                    }
                )
            ),
            ...toAdd.map(i =>
                cartRepository.create({
                    productId: i.productId,
                    userId,
                    quantity: i.quantity
                })
            )
        ]);

        const updatedCart = await cartRepository.findMany(
            {
                userId
            },
            {
                include: {
                    product: {
                        include: {
                            subCategories: {
                                include: {
                                    subCategory: {
                                        include: {
                                            category: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        );
        
        return updatedCart;
    }
}

export default new ProductService();
