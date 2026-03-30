import { card_brand } from "../../generated/prisma";
import cardRepository from "./card.repository";

class PaymentService {
    async createCard(userId: number, data: {
        nickname: string;
        holder: string;
        brand: card_brand;
        number: string;
    }) {
        const card = await cardRepository.findFirst(
            {
                userId,
                nickname: data.nickname
            }
        )

        if(card) throw new Error("Apelido ja cadastrado")

        const last4 = data.number.slice(-4);

        const token = Math.random().toString(36).substring(2, 18); // 16 caracteres alfanuméricos

        return await cardRepository.create({
            userId,
            nickname: data.nickname,
            holder: data.holder,
            brand: data.brand,
            last4,
            token
        });
    }

    async setPrimaryCard(userId: number, cardId: number) {
        const card = await cardRepository.findUnique(
            {
                id: cardId,
                userId
            }
        );

        if (!card) {
            throw new Error('Cartão não encontrado');
        }

        await cardRepository.updateMany(
            {
                primary: true,
                userId,
                isDelete: false
            },
            {
                primary: false
            }
        )

        return await cardRepository.update(
            {
                id: card.id
            },
            {
                primary: true
            }
        )
    }

    async deleteCard(userId: number, cardId: number) {
        const card = await cardRepository.findUnique(
            {
                id: cardId,
                userId
            }
        );

        if (!card) {
            throw new Error('Cartão não encontrado');
        }

        return await cardRepository.delete(
            {
                id: cardId
            }
        )
    }
}

export default new PaymentService();
