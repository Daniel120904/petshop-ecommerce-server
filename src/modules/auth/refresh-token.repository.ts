import { TypedRepository } from "../../base/base.typed-repository";
import { prisma } from "../../core/database/prisma.client";

class RefreshTokenRepository extends TypedRepository<typeof prisma.refresh_token> {
    protected model = prisma.refresh_token;
}

export default new RefreshTokenRepository();
