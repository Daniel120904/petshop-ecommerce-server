import { prisma } from '../../infrastructure/database/prisma.client';
import { createRepository } from '../../utils/with-overloads';

const CityBase = createRepository(prisma.city);

class CityRepository extends CityBase {
    async upsert(name: string, stateId: number) {
        return prisma.city.upsert({
            where: { name_stateId: { name, stateId } },
            update: {},
            create: { name, stateId },
        });
    }

}

export default new CityRepository();