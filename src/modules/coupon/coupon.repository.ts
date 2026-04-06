import { TypedRepository } from '../../base/base.typed-repository';
import { prisma } from '../../infrastructure/database/prisma.client';

class CouponRepository extends TypedRepository<typeof prisma.coupon> {
    protected model = prisma.coupon;
}

export default new CouponRepository();
