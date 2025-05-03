import { Request, Response } from "express";
import prisma from "../config/database";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, categoryId } = req.body;

  try {
    const product = await prisma.product.create({
      data: { name, price, categoryId },
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar produto." });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, categoryId } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { name, price, categoryId },
    });

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar produto." });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({ where: { id } });
    res.json({ message: "Produto removido com sucesso." });
  } catch (error) {
    res.status(400).json({ error: "Erro ao remover produto." });
  }
};
