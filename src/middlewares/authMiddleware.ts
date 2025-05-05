import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import { RoleName } from "@prisma/client";

const secret = process.env.JWT_SECRET || "secret";

// Middleware para verificar se o token JWT é válido
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    next(
      new AppError(
        "Acesso negado. Token não fornecido.",
        HttpStatusCode.UNAUTHORIZED
      )
    );
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    next();
  } catch (error) {
    next(new AppError("Token inválido ou expirado.", HttpStatusCode.FORBIDDEN));
    return;
  }
};

// Middleware para verificar permissões de usuário (admin, manager, etc.)
export const authorizeRoles = (allowedRoles: RoleName[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role; // Obtém a role do usuário

    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(
        new AppError(
          "Acesso negado. Usuáro não tem permissão.",
          HttpStatusCode.FORBIDDEN
        )
      );
    }

    next(); // Usuário autorizado, segue para a rota
  };
};
