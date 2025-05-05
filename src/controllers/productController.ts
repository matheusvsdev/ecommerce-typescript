import { NextFunction, Request, Response } from "express";
import prisma from "../config/database";
import { productSchema } from "../validations/productValidation";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    /*
    Exemplo com TypeORM
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find();
    */

    const products = await prisma.product.findMany({
      include: { category: true },
    });

    // Remover o campo `categoryId` antes de enviar a resposta
    const formattedProducts = products.map(({ categoryId, ...rest }) => rest);

    res.json(formattedProducts);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  productSchema.parse(req.body);
  const { name, price, categoryId } = req.body;

  try {
    if (!name || !price || !categoryId) {
      return next(
        new AppError(
          "Dados inválidos para criação.",
          HttpStatusCode.BAD_REQUEST
        )
      );
    }

    const existingProduct = await prisma.product.findFirst({ where: { name } });
    if (existingProduct) {
      return next(new AppError("Produto já existe.", HttpStatusCode.CONFLICT));
    }

    const product = await prisma.product.create({
      data: { name, price, categoryId },
    });

    res.status(HttpStatusCode.CREATED).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
      },
    });
    if (!product) {
      return next(
        new AppError("Produto não encontrado.", HttpStatusCode.NOT_FOUND)
      );
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, price, categoryId } = req.body;

  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return next(
        new AppError("Produto não encontrado.", HttpStatusCode.NOT_FOUND)
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, price, categoryId },
    });

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return next(
        new AppError("Produto não encontrado.", HttpStatusCode.NOT_FOUND)
      );
    }

    await prisma.product.delete({ where: { id } });
    res.status(HttpStatusCode.OK).json({
      success: true,
      status: "200 OK",
      message: "Produto removido com sucesso.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
