import { TypedRepository } from "../../base/base.typed-repository";
import { prisma } from "../../core/database/prisma.client";

class ActiveTokenRepository extends TypedRepository<typeof prisma.active_token> {
    protected model = prisma.active_token;
}

export default new ActiveTokenRepository();

