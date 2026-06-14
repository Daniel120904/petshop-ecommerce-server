"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../utils/schemas");
const cart_schema_1 = require("../../utils/schemas/cart.schema");
const common_schema_1 = require("../../utils/schemas/common.schema");
exports.productSchema = {
    listProduct: (0, common_schema_1.validatePagination)(),
    getProduct: zod_1.z.object({
        productId: (0, schemas_1.coerceId)('Produto')
    }),
    createProduct: zod_1.z.object({
        name: zod_1.z.string().min(1),
        price: zod_1.z.number().positive(),
        stock: zod_1.z.number().int().min(0),
        images: zod_1.z.array(zod_1.z.url()).optional(),
        description: zod_1.z.string().optional(),
        categoryId: (0, schemas_1.coerceId)('Categoria'),
        subCategoryIds: zod_1.z.array((0, schemas_1.coerceId)('SubCategoria')).min(1)
    }),
    deleteProduct: zod_1.z.object({
        productId: (0, schemas_1.coerceId)('Produto')
    }),
    editProduct: zod_1.z.object({
        productId: (0, schemas_1.coerceId)('Produto'),
        name: zod_1.z.string().min(1),
        price: zod_1.z.number().positive(),
        stock: zod_1.z.number().int().min(0),
        description: zod_1.z.string().optional(),
        images: zod_1.z.array(zod_1.z.url()).optional(),
        categoryId: (0, schemas_1.coerceId)('Categoria'),
        subCategoryIds: zod_1.z.array((0, schemas_1.coerceId)('SubCategoria')).min(1)
    }),
    activeProduct: zod_1.z.object({
        productId: (0, schemas_1.coerceId)('Produto'),
        active: zod_1.z.boolean()
    }),
    addCart: zod_1.z.object({
        productId: (0, schemas_1.coerceId)('Produto'),
        quantity: zod_1.z.number().positive()
    }),
    removeCart: zod_1.z.object({
        productId: (0, schemas_1.coerceId)('Produto'),
    }),
    updateCart: zod_1.z.object({
        items: zod_1.z.array(cart_schema_1.cartItemSchema)
    }),
    getSubCategories: zod_1.z.object({
        categoryId: zod_1.z.optional((0, schemas_1.coerceId)('Categoria'))
    }),
    chatBotReq: zod_1.z.object({
        message: zod_1.z.string()
    })
};
