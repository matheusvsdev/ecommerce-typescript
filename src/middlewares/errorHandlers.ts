import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new AppError("Rota não encontrada.", HttpStatusCode.NOT_FOUND));
};

export const conflictHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new AppError("Conflito de dados.", HttpStatusCode.CONFLICT));
};

export const unprocessableEntityHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(
    new AppError(
      "Dados inválidos ou mal formatados.",
      HttpStatusCode.UNPROCESSABLE_ENTITY
    )
  );
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR] ${err.message} - ${req.path}`);

  const statusCode =
    err instanceof AppError
      ? err.statusCode
      : HttpStatusCode.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Erro interno no servidor.",
    timestamp: err.timestamp || new Date().toISOString(),
  });
};
