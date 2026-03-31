import { TypedRepository } from '../../base/base.typed-repository';
import { prisma } from '../../infrastructure/database/prisma.client';

class RoleRepository extends TypedRepository<typeof prisma.role> {
    protected model = prisma.role;
}

export default new RoleRepository();