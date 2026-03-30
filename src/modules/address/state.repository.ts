import { prisma } from '../../infrastructure/database/prisma.client';
import { createRepository } from '../../utils/with-overloads';

const StateBase = createRepository(prisma.state);

class StateRepository extends StateBase {}

export default new StateRepository();