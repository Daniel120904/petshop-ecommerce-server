import { phone_type } from "../../generated/prisma";
import phoneRepository from "./phone.repository";

class PhoneService {
    async create(userId: number, number: string, type: phone_type, ddd: string) {
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
