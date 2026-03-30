import { PermissionLevel } from "../../utils/constants/permission.constants";
import { RoleName } from "../../utils/constants/role.constants";
import authRepository from "../auth/auth.repository";
import authService from "../auth/auth.service";
import userRepository from "./user.repository";

class UserService {
    async delete(id: number) {
        const user = await userRepository.findUnique(
            { 
                id 
            }, 
            { 
                include: { 
                    authentication: true,
                    role: true
                } 
            },
        );

        if(!user) {
            throw new Error('Usuário não encontrado');
        }

        if(user?.role.name == RoleName.MASTER) {
            throw new Error('Não é possivel deletar um usuario master')
        }

        await authService.logoutAll(id);

        if(user?.authentication) {
            await authRepository.delete({ id: user.authentication.id });
        }

        return await userRepository.delete({ id });
    }
}

export default new UserService();
