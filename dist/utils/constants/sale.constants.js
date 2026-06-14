"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_STATUS_FLOW = void 0;
const client_1 = require("@prisma/client");
exports.BASE_STATUS_FLOW = {
    processing: [client_1.SaleStatus.approved, client_1.SaleStatus.canceled],
    approved: [client_1.SaleStatus.shipped, client_1.SaleStatus.canceled],
    shipped: [client_1.SaleStatus.delivered],
    delivered: [],
    canceled: []
};
