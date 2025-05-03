import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/database";

const secret = process.env.JWT_SECRET || "secret";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, roleId } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, roleId },
    });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Erro ao registrar usuário." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Credenciais inválidas." });
      return;
    }

    const token = jwt.sign({ userId: user.id, role: user.roleId }, secret, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Erro no login." });
  }
};
