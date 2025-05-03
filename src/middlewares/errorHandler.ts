import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // Log do erro para depuração

  if (err.name === "ValidationError") {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Acesso não autorizado." });
    return;
  }

  res.status(500).json({ error: "Erro interno no servidor." });
  return;
};
