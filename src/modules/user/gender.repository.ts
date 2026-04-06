import { TypedRepository } from '../../base/base.typed-repository';
import { prisma } from '../../core/database/prisma.client';

class GenderRepository extends TypedRepository<typeof prisma.gender> {
    protected model = prisma.gender;
}

export default new GenderRepository();