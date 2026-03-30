import { prisma } from "../../infrastructure/database/prisma.client";
import { createRepository } from "../../utils/with-overloads";

const ActiveTokenBase = createRepository(prisma.active_token);

class ActiveTokenRepository extends ActiveTokenBase {}

export default new ActiveTokenRepository();
