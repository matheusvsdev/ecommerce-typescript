import prisma from "../config/database";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export async function getProductsService() {
  const products = await prisma.product.findMany({
    include: { category: true },
  });

  return products.map(({ categoryId, ...rest }) => rest); // Removendo `categoryId` antes de retornar
}

export async function createProductService(
  name: string,
  price: number,
  categoryId: string
) {
  if (!name || !price || !categoryId) {
    throw new AppError(
      "Dados inválidos para criação.",
      HttpStatusCode.BAD_REQUEST
    );
  }

  const existingProduct = await prisma.product.findFirst({ where: { name } });
  if (existingProduct)
    throw new AppError("Produto já existe.", HttpStatusCode.CONFLICT);

  return prisma.product.create({
    data: { name, price, categoryId },
  });
}

export async function getProductByIdService(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      price: true,
      category: true,
    },
  });

  if (!product)
    throw new AppError("Produto não encontrado.", HttpStatusCode.NOT_FOUND);
  return product;
}

export async function updateProductService(
  id: string,
  name: string,
  price: number,
  categoryId: string
) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product)
    throw new AppError("Produto não encontrado.", HttpStatusCode.NOT_FOUND);

  return prisma.product.update({
    where: { id },
    data: { name, price, categoryId },
  });
}

export async function deleteProductService(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product)
    throw new AppError("Produto não encontrado.", HttpStatusCode.NOT_FOUND);

  await prisma.product.delete({ where: { id } });
  return {
    success: true,
    status: "200 OK",
    message: "Produto removido com sucesso.",
  };
}
