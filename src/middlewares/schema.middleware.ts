import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateDto = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req.method === "GET" ? req.query : req.body;
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        message: 'Erro de validação',
        errors,
      });
    }
    if (req.method === "GET") {
      Object.assign(req.query, result.data);
    } else {
      req.body = result.data;
    }

    next();
  };
};
