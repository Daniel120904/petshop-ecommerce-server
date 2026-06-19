import { shippingService } from "../../infrastructure/melhor-envio/shippingService";
import { validateZip } from "../../utils/schemas";
import addressRepository from "./address.repository";
import cityRepository from "./city.repository";
import stateRepository from "./state.repository";

class AddressService {
    async create(userId: number, data: {
        street: string;
        nickname: string;
        number: string;
        complement?: string;
        neighborhood: string;
        zip: string;
        city: string;
        state: string;
    }) {
        const address = await addressRepository.findFirst(
            {
                userId,
                nickname: data.nickname
            }
        )

        if(address) throw new Error("Apelido ja cadastrado");

        const state = await stateRepository.findFirst({
            abbreviation: data.state,
        });

        if (!state) throw new Error(`Estado '${data.state}' não encontrado`);

        const city = await cityRepository.upsert(data.city, state.id);

        await shippingService.validateZipExists(data.zip)

        return await addressRepository.create({
            userId,
            nickname: data.nickname,
            street: data.street,
            number: data.number,
            complement: data.complement,
            neighborhood: data.neighborhood,
            zip: data.zip,
            cityId: city.id,
        });
    }

    async edit(addressId: number, data: {
        street?: string;
        nickname?: string;
        number?: string;
        complement?: string;
        neighborhood?: string;
        zip?: string;
        city?: string;
        state?: string;
        userId?: number;
    }) {
        const address = await addressRepository.findUnique(
            {
                id: addressId
            },
            {
                include: {
                    city: true
                }
            }
        );

        if (!address) {
            throw new Error('Endereço não encontrado');
        }

        const nicknameValidation = await addressRepository.findFirst(
            {
                userId: data.userId,
                nickname: data.nickname,
                id: { not: addressId }
            }
        )

        if(nicknameValidation) throw new Error("Apelido ja cadastrado");

        let cityId = address.cityId;

        if (data.state || data.city) {
            const state = data.state
                ? await stateRepository.findFirst({
                    abbreviation: data.state,
                })
                : null;

            if (data.state && !state) {
                throw new Error(`Estado '${data.state}' não encontrado`);
            }

            if (data.city) {
                const city = await cityRepository.upsert(
                    data.city,
                    state?.id ?? address.city.stateId
                );

                cityId = city.id;
            }
        }

        return await addressRepository.update(
            {
                id: addressId
            }, {
                ...(data.nickname !== undefined && { nickname: data.nickname }),
                ...(data.street !== undefined && { street: data.street }),
                ...(data.number !== undefined && { number: data.number }),
                ...(data.complement !== undefined && { complement: data.complement }),
                ...(data.neighborhood !== undefined && { neighborhood: data.neighborhood }),
                ...(data.zip !== undefined && { zip: data.zip }),
            cityId,
        });
    }
}

export default new AddressService();
