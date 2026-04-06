import { TypedRepository } from '../../base/base.typed-repository';
import { prisma } from '../../core/database/prisma.client';

class ProductSubCategoryRepository extends TypedRepository<typeof prisma.product_sub_category> {
    protected model = prisma.product_sub_category;
}

export default new ProductSubCategoryRepository();