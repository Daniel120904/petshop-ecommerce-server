import { prisma } from '../../infrastructure/database/prisma.client';
import { createRepository } from '../../utils/with-overloads';

const AuthBase = createRepository(prisma.authentication);

class AuthRepository extends AuthBase {}

export default new AuthRepository();