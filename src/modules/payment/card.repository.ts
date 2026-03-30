import { Prisma } from '../../generated/prisma';
import { prisma } from '../../infrastructure/database/prisma.client';
import { createRepository } from '../../utils/with-overloads';

const CardBase = createRepository(prisma.card);

class CardRepository extends CardBase {
    protected async beforeCreate(data: Prisma.cardUncheckedCreateInput) {
        const hasCard = await this.findFirst({
            userId: data.userId,
            primary: true,
        });

        if(hasCard && data.primary) {
            await this.update(
                {
                    id: hasCard.id
                },
                {
                    primary: false
                }
            )
        }

        return { ...data, primary: !hasCard };
    }
}

export default new CardRepository();