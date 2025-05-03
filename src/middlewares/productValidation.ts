import { Request, Response, NextFunction } from "express";

export const validateProductInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, price, categoryId } = req.body;

  if (!name || typeof price !== "number" || !categoryId) {
    res
      .status(400)
      .json({ error: "Nome, preço e categoria são obrigatórios." });
    return;
  }

  next();
};
