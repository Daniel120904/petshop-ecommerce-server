import { PhoneType } from '@prisma/client';
import phoneRepository from "./phone.repository";

class PhoneService {
    async create(userId: number, number: string, type: PhoneType, ddd: string) {
        return await phoneRepository.create(
            {
                userId,
                ddd,
                number,
                type
            }
        )
    }
}

export default new PhoneService();
