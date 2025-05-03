import { Request, Response, NextFunction } from "express";

export const validateOrderInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, products, addressId } = req.body;

  if (!userId || !products || products.length === 0 || !addressId) {
    res
      .status(400)
      .json({ error: "Usuário, produtos e endereço são obrigatórios." });
    return;
  }

  next();
};
