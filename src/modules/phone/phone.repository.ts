import { TypedRepository } from '../../base/base.typed-repository';
import { prisma } from '../../core/database/prisma.client';

class PhoneRepository extends TypedRepository<typeof prisma.phone> {
    protected hasDeleteFlag = true;
    protected model = prisma.phone;
}

export default new PhoneRepository();