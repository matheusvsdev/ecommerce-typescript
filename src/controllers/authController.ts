import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/database";
import { authSchema } from "../validations/authValidation";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import { AppError } from "../utils/AppError";
import { RoleName } from "@prisma/client";

const secret = process.env.JWT_SECRET || "secret";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    authSchema.parse(req.body);
    const { name, email, password } = req.body;

    const emailExists = await prisma.user.findUnique({
      where: { email: email },
    });
    if (emailExists) {
      return next(
        new AppError("Email já está em uso.", HttpStatusCode.CONFLICT)
      );
    }

    // Verifica se o roleId existe no banco
    const userRole = await prisma.role.findUnique({
      where: { name: RoleName.USER },
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, roleId: userRole!.id },
    });

    // Removendo a senha da resposta
    const { password: _, ...userWithoutPassword } = user;
    res.status(HttpStatusCode.CREATED).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(
        new AppError("Credenciais inválidas.", HttpStatusCode.UNAUTHORIZED)
      );
    }

    const token = jwt.sign({ userId: user.id, role: user.roleId }, secret, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
