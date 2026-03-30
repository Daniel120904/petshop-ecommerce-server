import { prisma } from '../../infrastructure/database/prisma.client';
import { createRepository } from '../../utils/with-overloads';

const UserBase = createRepository(prisma.user);

class UserRepository extends UserBase {}

export default new UserRepository();
