import { ValidatedRequest } from "../../utils/types/validate.types";
import { Request, Response } from 'express';
import { productSchema } from "./product.schema";
import productRepository from "./product.repository";
import productService from "./product.service";
import categoryRepository from "./category.repository";
import subCategoryRepository from "./subCategory.repository";
import cartRepository from "./cart.repository";

class ProductController {
    async getProducts(req: ValidatedRequest<typeof productSchema.listProduct>, res: Response) {
        const { orderBy, page, pageSize } = req.validated;

        const result = await productRepository.findMany(
            {
                active: true
            },
            {
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
            }
        )

        return res.status(200).json({
            data: result,
        });
    }

    async getProduct(req: ValidatedRequest<typeof productSchema.getProduct>, res: Response) {
        const { productId } = req.validated;

        const result = await productRepository.findUnique(
            {
                id: productId,
                active: true,
            }
        )

        return res.status(200).json({
            data: result,
        });
    }

    async createProduct(req: ValidatedRequest<typeof productSchema.createProduct>, res: Response) {
        const result = await productService.createProduct(req.validated)

        return res.status(200).json({
            data: result,
        });
    }

    async activeProduct(req: ValidatedRequest<typeof productSchema.activeProduct>, res: Response) {
        const { productId, active } = req.validated;        
        
        const result = await productService.activeProduct(productId, active);

        return res.status(200).json({
            data: result,
        });
    }

    async deleteProduct(req: ValidatedRequest<typeof productSchema.deleteProduct>, res: Response) {
        const { productId } = req.validated;

        const result = await productService.deleteProduct(productId);

        return res.status(200).json({
            data: result,
        });
    }

    async editProduct(req: ValidatedRequest<typeof productSchema.editProduct>, res: Response) {
        const result = await productService.editProduct(req.validated);

        return res.status(200).json({
            data: result,
        });
    }

    async getCart(req: Request, res: Response) {
        const { userId } = req.user!;

        const result = await cartRepository.findMany(
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

        return res.status(200).json({
            data: result,
        });
    }

    async addCart(req: ValidatedRequest<typeof productSchema.addCart>, res: Response) {
        const { quantity, productId } = req.validated;
        const { userId } = req.user!;

        const result = await productService.addCart({
            productId,
            quantity,
            userId
        });

        return res.status(200).json({
            data: result
        })
    }

    async removeCart(req: ValidatedRequest<typeof productSchema.removeCart>, res: Response) {
        const { productId } = req.validated;
        const { userId } = req.user!;

        const result = await productService.removeCart(
            {
                productId,
                userId
            }
        );

        return res.status(200).json({
            data: result
        })
    }

    async updateCart(req: ValidatedRequest<typeof productSchema.updateCart>, res: Response) {
        const { userId } = req.user!;
        const { items } = req.validated;

        const result = await productService.updateCart(userId, items);

        return res.status(200).json({
            data: result
        })
    }

    async getCategories(req: Request, res: Response) {
        const result = await categoryRepository.findMany();

        return res.status(200).json({
            data: result
        })
    }

    async getSubCategories(req: ValidatedRequest<typeof productSchema.getSubCategories>, res: Response) {
        const { categoryId } = req.validated;

        const result = await subCategoryRepository.findMany(
            {
                categoryId,

            },
            {
                include: {
                    category: true
                }
            }
        );

        return res.status(200).json({
            data: result
        })
    }
}

export default new ProductController();