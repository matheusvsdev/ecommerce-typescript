import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR] ${err.message} - ${err.timestamp}`);

  const statusCode =
    err instanceof AppError
      ? err.statusCode
      : HttpStatusCode.INTERNAL_SERVER_ERROR;
  const statusText = HttpStatusCode[statusCode] || "Internal Server Error"; // Obtém descrição textual do status

  res.status(statusCode).json({
    success: false,
    status: `${statusCode} ${statusText}`, // Exibe o código HTTP com descrição
    message: err.message || "Erro interno no servidor.",
    timestamp: err.timestamp || new Date().toISOString(),
  });
};
