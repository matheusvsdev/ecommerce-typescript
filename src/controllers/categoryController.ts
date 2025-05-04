import { Request, Response } from "express";
import prisma from "../config/database";
import { categorySchema } from "../validations/categoryValidation";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ error: "Erro ao buscar categorias." });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  // Valida dados com Zod
  categorySchema.parse(req.body);
  const { name } = req.body;

  try {
    const category = await prisma.category.create({ data: { name } });
    res.status(HttpStatusCode.OK).json(category);
  } catch (error) {
    res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: "Erro ao criar categoria." });
  }
};
