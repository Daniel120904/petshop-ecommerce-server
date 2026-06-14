import { PrismaClient } from '@prisma/client';
import { RoleName } from '../../utils/constants/role.constants';
import roleRepository from './role.repository';

const prisma = new PrismaClient();

class RoleService {
    async getRole(roleName: RoleName) {
        const role = await roleRepository.findUnique(
            { name: roleName },
        );

        if(!role) throw new Error('Role não encontrada');

        return role;
    }
}

export default new RoleService();