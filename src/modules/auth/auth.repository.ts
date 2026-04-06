import { TypedRepository } from '../../base/base.typed-repository';
import { prisma } from '../../core/database/prisma.client';

class AuthRepository extends TypedRepository<typeof prisma.authentication> {
    protected model = prisma.authentication;
}

export default new AuthRepository();
