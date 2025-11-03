import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateDto = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req.method === "GET" ? req.query : req.body;
    const result = schema.safeParse(data);
    if (!result.success) {
      return res.status(400).json(result.error.format());
    }
    if (req.method === "GET") {
      Object.assign(req.query, result.data);
    } else {
      req.body = result.data;
    }

    next();
  };
};
