import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export const validateData = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body); // **Valida os dados**
      next(); // Continua para o controller se estiver tudo certo
    } catch (error: any) {
      next(new AppError(error.errors[0].message, HttpStatusCode.BAD_REQUEST)); // Envia erro de validação
    }
  };
};
