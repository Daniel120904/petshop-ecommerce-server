import { sale_status } from "../../generated/prisma";

export const BASE_STATUS_FLOW: Record<sale_status, sale_status[]> = {
    processing: [sale_status.approved, sale_status.canceled],
    approved: [sale_status.shipped, sale_status.canceled],
    shipped: [sale_status.delivered],
    delivered: [],
    canceled: []
};