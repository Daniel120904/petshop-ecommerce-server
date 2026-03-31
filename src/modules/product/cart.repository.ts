import { TypedRepository } from '../../base/base.typed-repository';
import { prisma } from '../../infrastructure/database/prisma.client';

class CartRepository extends TypedRepository<typeof prisma.cart_item> {
    protected model = prisma.cart_item;
}

export default new CartRepository();