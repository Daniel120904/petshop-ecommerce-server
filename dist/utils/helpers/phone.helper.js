"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPhoneType = getPhoneType;
const client_1 = require("@prisma/client");
function getPhoneType(number) {
    return number.length === 9 ? client_1.PhoneType.cellphone : client_1.PhoneType.telephone;
}
