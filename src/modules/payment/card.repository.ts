import { TypedRepository } from '../../base/base.typed-repository';
import { Prisma } from '@prisma/client';
import { prisma } from '../../core/database/prisma.client';

class CardRepository extends TypedRepository<typeof prisma.card> {
    protected model = prisma.card;

    protected async beforeCreate(data: Prisma.cardUncheckedCreateInput) {
        const hasCard = await this.findFirst({
            userId: data.userId,
            primary: true,
        });

        return { ...data, primary: !hasCard };
    }
}

export default new CardRepository();