import { prisma } from '../../infrastructure/database/prisma.client';
import { createRepository } from '../../utils/with-overloads';

const AddressBase = createRepository(prisma.address);

class AddressRepository extends AddressBase {}

export default new AddressRepository();