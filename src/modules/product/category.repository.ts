import { TypedRepository } from "../../base/base.typed-repository";
import { prisma } from "../../infrastructure/database/prisma.client";

class CategoryRepository extends TypedRepository<typeof prisma.category> {
    protected model = prisma.category;
}

export default new CategoryRepository();