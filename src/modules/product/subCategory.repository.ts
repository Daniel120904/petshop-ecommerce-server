import { TypedRepository } from '../../base/base.typed-repository';
import { prisma } from '../../core/database/prisma.client';

class SubCategoryRepository extends TypedRepository<typeof prisma.sub_category> {
    protected model = prisma.sub_category;
}

export default new SubCategoryRepository();