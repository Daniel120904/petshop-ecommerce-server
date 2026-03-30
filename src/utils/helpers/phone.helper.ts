import { phone_type } from "../../generated/prisma";


export function getPhoneType(number: string): phone_type {
    return number.length === 9 ? phone_type.cellphone : phone_type.telephone;
}