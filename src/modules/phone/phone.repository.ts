import { prisma } from '../../infrastructure/database/prisma.client';
import { createRepository } from '../../utils/with-overloads';

const PhoneBase = createRepository(prisma.phone);

class PhoneRepository extends PhoneBase {}

export default new PhoneRepository();