import { Request, Response } from "express";
import prisma from "../config/database";

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar roles." });
  }
};

export const createRole = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const role = await prisma.role.create({ data: { name } });
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar role." });
  }
};
