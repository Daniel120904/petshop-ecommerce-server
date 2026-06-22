import { TypedRepository } from '../../base/base.typed-repository';
import { prisma } from '../../core/database/prisma.client';

class AddressRepository extends TypedRepository<typeof prisma.address> {
    protected hasDeleteFlag = true;
    protected model = prisma.address;
}

export default new AddressRepository();
