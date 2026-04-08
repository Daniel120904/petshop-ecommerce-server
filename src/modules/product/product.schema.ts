import { z } from 'zod';
import { coerceId } from '../../utils/schemas';
import { cartItemSchema } from '../../utils/schemas/cart.schema';
import { validatePagination } from '../../utils/schemas/common.schema';

export const productSchema = {
    listProduct: validatePagination(), 
    getProduct: z.object({
        productId: coerceId('Produto')
    }),
    createProduct: z.object({
        name: z.string().min(1),
        price: z.number().positive(),
        stock: z.number().int().min(0),
        images: z.array(z.url()).optional(),
        categoryId: coerceId('Categoria'),
        subCategoryIds: z.array(coerceId('SubCategoria')).min(1)
    }),
    deleteProduct: z.object({
        productId: coerceId('Produto')
    }),
    editProduct: z.object({
        productId: coerceId('Produto'),
        name: z.string().min(1),
        price: z.number().positive(),
        stock: z.number().int().min(0),
        images: z.array(z.url()).optional(),
        categoryId: coerceId('Categoria'),
        subCategoryIds: z.array(coerceId('SubCategoria')).min(1)
    }),
    activeProduct: z.object({
        productId: coerceId('Produto'),
        active: z.boolean()
    }),

    addCart: z.object({
        productId: coerceId('Produto'),
        quantity: z.number().positive()
    }),
    removeCart: z.object({
        productId: coerceId('Produto'),
    }),
    updateCart: z.object({
        items: z.array(cartItemSchema)
    }),

    getSubCategories: z.object({
        categoryId: z.optional(coerceId('Categoria'))
    })
};
