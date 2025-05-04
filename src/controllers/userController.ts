import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/database";
import { userSchema } from "../validations/userValidation";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany({ include: { role: true } });
    res.json(users);
  } catch (error) {
    next();
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // Valida dados com Zod
  userSchema.parse(req.body);
  const { name, email, password, roleId } = req.body;

  // Verifica se o roleId existe no banco
  const roleExists = await prisma.role.findUnique({ where: { id: roleId } });
  if (!roleExists) {
    throw new AppError("Role ID não encontrado.", HttpStatusCode.BAD_REQUEST);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, roleId },
    });

    // Remover a senha da resposta
    const { password: _, ...userWithoutPassword } = user;
    res.status(HttpStatusCode.CREATED).json({
      success: true,
      status: "201 Created",
      message: "Usuário criado com sucesso.",
      data: userWithoutPassword,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
