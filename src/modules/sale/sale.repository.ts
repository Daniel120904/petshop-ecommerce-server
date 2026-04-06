import { TypedRepository } from '../../base/base.typed-repository';
import { prisma } from '../../infrastructure/database/prisma.client';

class SaleRepository extends TypedRepository<typeof prisma.sale> {
    protected model = prisma.sale;
}

export default new SaleRepository();
