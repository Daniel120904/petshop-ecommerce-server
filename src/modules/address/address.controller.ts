import { Request, Response } from 'express';
import addressService from './address.service';
import addressRepository from './address.repository';
import { addressSchema } from './address.schema';
import { ValidatedRequest } from '../../utils/types/validate.types';

class AddressController {
    async create(req: ValidatedRequest<typeof addressSchema.create>, res: Response) {
        const { street, nickname, number, complement, neighborhood, zip, city, state } = req.validated;
        const { userId } = req.user!;
        console.log(userId)
        const result = await addressService.create(userId, {
            street,
            nickname,
            number,
            complement,
            neighborhood,
            zip,
            city,
            state,
        });

        return res.status(200).json({
            data: result,
        });
    }

    async delete(req: ValidatedRequest<typeof addressSchema.delete>, res: Response) {
        const { addressId } = req.validated;
        const { userId } = req.user!;

        const result = await addressRepository.delete(
            {
                id: addressId,
                userId
            }
        )

        return res.status(200).json({
            data: result,
        });
    }

    async edit(req: ValidatedRequest<typeof addressSchema.edit>, res: Response) {
        const { addressId, street, nickname, number, complement, neighborhood, zip, city, state } = req.validated;
        const { userId } = req.user!;

        const address = await addressRepository.findUnique(
            {
                userId,
                id: addressId
            }
        );

        if(!address) throw new Error('Endereço não encontrado');

        const result = await addressService.edit(address.id, {
            street,
            nickname,
            number,
            complement,
            neighborhood,
            zip,
            city,
            state,
            userId
        });

        return res.status(200).json({
            data: result,
        });
    }

    async get(req: ValidatedRequest<typeof addressSchema.get>, res: Response) {
        const { page, pageSize, sort } = req.validated; 
        const { userId } = req.user!;

        const result = await addressRepository.findMany(
            {
                userId
            },
            {
                orderBy: sort,
                pagination: {
                    page,
                    pageSize
                }
            }
        );

        return res.status(200).json({
            data: result,
        });
    }
}

export default new AddressController();