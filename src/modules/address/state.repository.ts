import { TypedRepository } from '../../base/base.typed-repository';
import { prisma } from '../../infrastructure/database/prisma.client';

class StateRepository extends TypedRepository<typeof prisma.state> {
    protected model = prisma.state;
}

export default new StateRepository();