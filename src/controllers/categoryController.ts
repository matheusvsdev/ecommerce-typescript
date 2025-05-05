import { NextFunction, Request, Response } from "express";
import prisma from "../config/database";
import { categorySchema } from "../validations/categoryValidation";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(HttpStatusCode.OK).json(categories);
  } catch (error) {
    console.error("[ERROR] Falha ao buscar categorias:", error); // Log para debug
    next(error); // Passando erro para o middleware global
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    categorySchema.parse(req.body);
    const { name } = req.body;

    const category = await prisma.category.create({ data: { name } });
    res.status(HttpStatusCode.CREATED).json(category);
  } catch (error) {
    console.error("[ERROR] Falha ao criar categoria:", error);
    next(error);
  }
};
