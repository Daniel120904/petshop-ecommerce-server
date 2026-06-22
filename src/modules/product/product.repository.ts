import { TypedRepository } from '../../base/base.typed-repository';
import { prisma } from '../../core/database/prisma.client';

class ProductRepository extends TypedRepository<typeof prisma.product> {
    protected hasDeleteFlag = true;
    protected model = prisma.product;
}

export default new ProductRepository();