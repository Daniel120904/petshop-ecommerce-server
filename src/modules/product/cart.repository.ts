import { prisma } from '../../infrastructure/database/prisma.client';
import { createRepository } from '../../utils/with-overloads';

const CartBase = createRepository(prisma.product);

class CartRepository extends CartBase {}

export default new CartRepository();