import { prisma } from "../../infrastructure/database/prisma.client";
import { createRepository } from "../../utils/with-overloads";

const RefreshTokenBase = createRepository(prisma.refresh_token);

class RefreshTokenRepository extends RefreshTokenBase {}

export default new RefreshTokenRepository();