"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_repository_1 = __importDefault(require("./product.repository"));
const product_service_1 = __importDefault(require("./product.service"));
const category_repository_1 = __importDefault(require("./category.repository"));
const subCategory_repository_1 = __importDefault(require("./subCategory.repository"));
const cart_repository_1 = __importDefault(require("./cart.repository"));
const recommendationAI_1 = require("../../infrastructure/gemini/recommendationAI");
class ProductController {
    async getProducts(req, res) {
        const { orderBy, page, pageSize } = req.validated;
        const result = await product_repository_1.default.findMany({
            active: true
        }, {
            pagination: {
                page,
                pageSize
            },
            orderBy,
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
        });
        return res.status(200).json({
            data: result,
        });
    }
    async getProduct(req, res) {
        const { productId } = req.validated;
        const result = await product_repository_1.default.findUnique({
            id: productId,
            active: true,
        });
        return res.status(200).json({
            data: result,
        });
    }
    async createProduct(req, res) {
        const result = await product_service_1.default.createProduct(req.validated);
        return res.status(200).json({
            data: result,
        });
    }
    async activeProduct(req, res) {
        const { productId, active } = req.validated;
        const result = await product_service_1.default.activeProduct(productId, active);
        return res.status(200).json({
            data: result,
        });
    }
    async deleteProduct(req, res) {
        const { productId } = req.validated;
        const result = await product_service_1.default.deleteProduct(productId);
        return res.status(200).json({
            data: result,
        });
    }
    async editProduct(req, res) {
        const result = await product_service_1.default.editProduct(req.validated);
        return res.status(200).json({
            data: result,
        });
    }
    async getCart(req, res) {
        const { userId } = req.user;
        const result = await cart_repository_1.default.findMany({
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
        return res.status(200).json({
            data: result,
        });
    }
    async addCart(req, res) {
        const { quantity, productId } = req.validated;
        const { userId } = req.user;
        const result = await product_service_1.default.addCart({
            productId,
            quantity,
            userId
        });
        return res.status(200).json({
            data: result
        });
    }
    async removeCart(req, res) {
        const { productId } = req.validated;
        const { userId } = req.user;
        const result = await product_service_1.default.removeCart({
            productId,
            userId
        });
        return res.status(200).json({
            data: result
        });
    }
    async updateCart(req, res) {
        const { userId } = req.user;
        const { items } = req.validated;
        const result = await product_service_1.default.updateCart(userId, items);
        return res.status(200).json({
            data: result
        });
    }
    async getCategories(req, res) {
        const result = await category_repository_1.default.findMany();
        return res.status(200).json({
            data: result
        });
    }
    async getSubCategories(req, res) {
        const { categoryId } = req.validated;
        const result = await subCategory_repository_1.default.findMany({
            categoryId,
        }, {
            include: {
                category: true
            }
        });
        return res.status(200).json({
            data: result
        });
    }
    async chatBot(req, res) {
        const { message } = req.validated;
        console.log(message);
        const resIA = await (0, recommendationAI_1.getAiRecommendation)(message);
        return res.status(200).json(resIA);
    }
}
exports.default = new ProductController();
