import { phone_type } from "../../generated/prisma";
import phoneRepository from "./phone.repository";

class PhoneService {
    async create(userId: number, number: string, type: phone_type, ddd: string) {
        try {
            return await phoneRepository.create(
                {
                    userId,
                    ddd,
                    number,
                    type
                }
            )
        } catch (error) {
            console.error('Erro na criação do telefone: ', error);
            throw error;
        }
    }
}

export default new PhoneService();
