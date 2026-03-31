import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = <T extends z.ZodType>(
    handler: (req: Request & { validated: z.infer<T> }, res: Response) => any,
    schema?: T
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!schema) {
            return handler(req as any, res)
        }

        const raw = {
            ...req.body,
            ...req.query,
            ...req.params,
        }

        const data = Object.fromEntries(
            Object.entries(raw).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
        )

        const result = schema.safeParse(data)

        if (!result.success) {
            const errors = result.error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }))

            res.status(400).json({ message: 'Erro de validação', errors })
            return
        }

        (req as any).validated = result.data
        handler(req as any, res)
    }
}