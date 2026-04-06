import { TypedRepository } from '../../base/base.typed-repository';
import { prisma } from '../../core/database/prisma.client';

class UserRepository extends TypedRepository<typeof prisma.user> {
    protected model = prisma.user;
}

export default new UserRepository();