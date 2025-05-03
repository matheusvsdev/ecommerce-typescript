import { Request, Response } from "express";
import prisma from "../config/database";

export const getAddress = async (req: Request, res: Response) => {
  try {
    const address = await prisma.address.findMany({
      include: { user: true },
    });
    res.json(address);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar endereços." });
  }
};

export const createAddress = async (req: Request, res: Response) => {
  const { zip, state, city, street, userId } = req.body;

  try {
    const address = await prisma.address.create({
      data: { zip, state, city, street, userId },
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar endereço." });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { zip, state, city, street } = req.body;

  try {
    const address = await prisma.address.update({
      where: { id },
      data: { zip, state, city, street },
    });

    res.json(address);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar endereço." });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.address.delete({ where: { id } });
    res.json({ message: "Endereço removido com sucesso." });
  } catch (error) {
    res.status(400).json({ error: "Erro ao remover endereço." });
  }
};
