import { SaleStatus } from '@prisma/client';


export function removeTransitions(
    flow: Record<SaleStatus, SaleStatus[]>,
    blocked: SaleStatus[]
): Record<SaleStatus, SaleStatus[]> {
    const newFlow: Record<SaleStatus, SaleStatus[]> = {} as any;

    for (const status in flow) {
        newFlow[status as SaleStatus] = flow[status as SaleStatus].filter(
            s => !blocked.includes(s)
        );
    }

    return newFlow;
}