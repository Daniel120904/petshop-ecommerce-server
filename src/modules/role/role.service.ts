import { PrismaClient } from '../../generated/prisma';
import { RoleName } from '../../utils/constants/role.constants';

const prisma = new PrismaClient();

class RoleService {
    async getRole(roleName: RoleName) {
        const role = await prisma.role.findUnique({
            where: { name: roleName },
        });

        if(!role) throw new Error('Role não encontrada');

        return role;
    }
}

export default new RoleService();