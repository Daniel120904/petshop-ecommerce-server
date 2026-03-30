import { z } from "zod"
import { Request } from "express"

export type ValidatedRequest<T extends z.ZodType = z.ZodType> = Omit<Request, 'body' | 'query' | 'params'> & {
    validated: z.infer<T>
}

export type ValidatedHandler<T extends z.ZodType = z.ZodType> = (
    req: ValidatedRequest<T>,
    res: Response
) => any