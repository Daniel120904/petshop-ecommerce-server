import { sale_status } from "../../generated/prisma";


export function removeTransitions(
    flow: Record<sale_status, sale_status[]>,
    blocked: sale_status[]
): Record<sale_status, sale_status[]> {
    const newFlow: Record<sale_status, sale_status[]> = {} as any;

    for (const status in flow) {
        newFlow[status as sale_status] = flow[status as sale_status].filter(
            s => !blocked.includes(s)
        );
    }

    return newFlow;
}