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
  const { name, email, password, roleId }: { name: string, email: string, password: string, roleId: string} = req.body;

  const emailExists = await prisma.user.findUnique({ where: { email: email } });
  if (emailExists) {
    throw new AppError("Email já está em uso.", HttpStatusCode.CONFLICT);
  }

  if (!roleId) {
    throw new AppError("Role ID é obrigatório.", HttpStatusCode.BAD_REQUEST);
  }

  // Verifica se o roleId existe no banco
  const roleExists = await prisma.role.findUnique({ where: { id: roleId } });
  if (!roleExists) {
    throw new AppError("Role ID não encontrado.", HttpStatusCode.NOT_FOUND);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, roleId },
      include: { role: true },
    });

    // Remover a senha da resposta
    const { password: _, roleId: __, ...userWithoutSensitiveData } = user;
    res.status(HttpStatusCode.CREATED).json({
      success: true,
      status: "201 Created",
      message: "Usuário criado com sucesso.",
      data: userWithoutSensitiveData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
