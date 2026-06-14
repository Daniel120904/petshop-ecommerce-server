import { SaleStatus } from '@prisma/client';

export const BASE_STATUS_FLOW: Record<SaleStatus, SaleStatus[]> = {
    processing: [SaleStatus.approved, SaleStatus.canceled],
    approved: [SaleStatus.shipped, SaleStatus.canceled],
    shipped: [SaleStatus.delivered],
    delivered: [],
    canceled: []
};