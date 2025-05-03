import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/database";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ include: { role: true } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, roleId } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, roleId },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar usuário." });
  }
};
