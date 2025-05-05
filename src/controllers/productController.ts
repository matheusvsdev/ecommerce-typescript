import { NextFunction, Request, Response } from "express";
import { productSchema } from "../validations/productValidation";
import {
  getProductsService,
  createProductService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} from "../services/productService";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await getProductsService();
    res.status(HttpStatusCode.OK).json(products);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    productSchema.parse(req.body);
    const { name, price, categoryId } = req.body;

    const newProduct = await createProductService(name, price, categoryId);
    res.status(HttpStatusCode.CREATED).json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await getProductByIdService(req.params.id);
    res.status(HttpStatusCode.OK).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, categoryId } = req.body;
    const updatedProduct = await updateProductService(
      req.params.id,
      name,
      price,
      categoryId
    );
    res.status(HttpStatusCode.OK).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await deleteProductService(req.params.id);
    res.status(HttpStatusCode.OK).json(response);
  } catch (error) {
    next(error);
  }
};
