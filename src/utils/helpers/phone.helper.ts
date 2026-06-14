import { PhoneType } from '@prisma/client';


export function getPhoneType(number: string): PhoneType {
    return number.length === 9 ? PhoneType.cellphone : PhoneType.telephone;
}