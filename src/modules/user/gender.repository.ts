import { prisma } from '../../infrastructure/database/prisma.client';
import { createRepository } from '../../utils/with-overloads';

const GenderBase = createRepository(prisma.gender);

class GenderRepository extends GenderBase {}

export default new GenderRepository();