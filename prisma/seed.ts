import { PrismaClient } from '../src/generated/prisma';
import{ RoleName } from '../src/utils/constants/role.constants';
import{ GenderName } from '../src/utils/constants/gender.constants';


const prisma = new PrismaClient();

async function main() {
    // Roles
    for (const role of Object.values(RoleName)) {
        await prisma.role.upsert({
            where: { name: role },
            update: {},
            create: { name: role },
        });
    }

    // Genders
    for (const name of Object.values(GenderName)) {
        await prisma.gender.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    console.log('Seed concluído!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());