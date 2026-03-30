import { prisma } from '../../infrastructure/database/prisma.client';
import { createRepository } from '../../utils/with-overloads';

const RoleBase = createRepository(prisma.role);

class RoleRepository extends RoleBase {}

export default new RoleRepository();