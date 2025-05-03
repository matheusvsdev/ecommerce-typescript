import { Request, Response, NextFunction } from "express";

export const validateUserInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, roleId } = req.body;

  if (!name || !email || !password || !roleId) {
    res.status(400).json({ error: "Todos os campos são obrigatórios." });
    return;
  }

  next();
};
