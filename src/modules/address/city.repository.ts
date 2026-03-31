import { TypedRepository } from '../../base/base.typed-repository';
import { prisma } from '../../infrastructure/database/prisma.client';

class CityRepository extends TypedRepository<typeof prisma.city> {
    protected model = prisma.city;
    
    async upsert(name: string, stateId: number) {
        return prisma.city.upsert({
            where: { name_stateId: { name, stateId } },
            update: {},
            create: { name, stateId },
        });
    }
}

export default new CityRepository();