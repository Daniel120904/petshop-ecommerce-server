"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_helper_1 = require("../../utils/helpers/category.helper");
const cart_repository_1 = __importDefault(require("./cart.repository"));
const product_repository_1 = __importDefault(require("./product.repository"));
const productSubCategory_repository_1 = __importDefault(require("./productSubCategory.repository"));
class ProductService {
    async createProduct(req) {
        const subCategories = await (0, category_helper_1.validateSubCategories)(req.categoryId, req.subCategoryIds);
        const product = await product_repository_1.default.findFirst({
            name: req.name
        });
        if (product)
            throw new Error("Já existe um produto com esse nome");
        return await product_repository_1.default.create({
            name: req.name,
            price: req.price,
            stock: req.stock,
            description: req.description,
            subCategories: {
                create: subCategories.map((sub) => ({
                    subCategoryId: sub.id
                }))
            }
        });
    }
    async activeProduct(productId, active) {
        return await product_repository_1.default.update({
            id: productId,
        }, {
            active: active
        });
    }
    async deleteProduct(productId) {
        return await product_repository_1.default.delete({
            id: productId
        });
    }
    async editProduct(req) {
        let subCategories;
        if (req.category) {
            subCategories = await (0, category_helper_1.validateSubCategories)(req.category.categoryId, req.category.subCategoryIds);
            await productSubCategory_repository_1.default.deleteMany({
                productId: req.productId
            });
        }
        if (req.name) {
            const product = await product_repository_1.default.findFirst({
                name: req.name,
                id: { not: req.productId }
            });
            if (product)
                throw new Error("Nome ja Cadastrado");
        }
        return await product_repository_1.default.update({
            id: req.productId
        }, {
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
            })
        });
    }
    async addCart(req) {
        const product = await product_repository_1.default.findUnique({
            active: true,
            id: req.productId
        }, {
            include: {
                cartItems: {
                    where: {
                        userId: req.userId
                    }
                }
            }
        });
        if (!product)
            throw new Error("Produto nao disponivel");
        if (product.cartItems.length)
            throw new Error("Produto ja esta no carrinho do usuario");
        return await cart_repository_1.default.create({
            productId: req.productId,
            userId: req.userId,
            quantity: req.quantity
        });
    }
    async removeCart(req) {
        return await cart_repository_1.default.delete({
            userId: req.userId,
            productId: req.productId
        });
    }
    async updateCart(userId, items) {
        const cart = await cart_repository_1.default.findMany({ userId });
        if (!cart.data.length)
            throw new Error("Carrinho não encontrado");
        const cartData = cart.data;
        const existingProductIds = cartData.map(i => i.productId);
        const toRemove = items.filter(i => i.quantity === 0).map(i => i.productId);
        const toUpdate = items.filter(i => i.quantity > 0 && existingProductIds.includes(i.productId));
        const toAdd = items.filter(i => i.quantity > 0 && !existingProductIds.includes(i.productId));
        let result;
        await Promise.all([
            ...toRemove.map(i => cart_repository_1.default.delete({
                productId: i,
                userId
            })),
            ...toUpdate.map(i => cart_repository_1.default.update({
                productId: i.productId,
                userId,
            }, {
                quantity: i.quantity
            })),
            ...toAdd.map(i => cart_repository_1.default.create({
                productId: i.productId,
                userId,
                quantity: i.quantity
            }))
        ]);
        const updatedCart = await cart_repository_1.default.findMany({
            userId
        }, {
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
        });
        return updatedCart;
    }
}
exports.default = new ProductService();
