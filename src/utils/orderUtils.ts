import prisma from "../config/database";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../utils/HttpStatusCode";

// Função para validar usuário e endereço
export async function validateUserAndAddress(
  userId: string,
  addressId: string
) {
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists)
    throw new AppError("Usuário não encontrado.", HttpStatusCode.NOT_FOUND);

  const addressExists = await prisma.address.findUnique({
    where: { id: addressId },
  });
  if (!addressExists)
    throw new AppError("Endereço não encontrado.", HttpStatusCode.NOT_FOUND);
}

// Função para calcular subtotal e formatar itens do pedido
export async function calculateOrderItems(products: any[]) {
  let subtotal = 0;
  const orderItems = [];

  for (const item of products) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product)
      throw new AppError(
        `Produto com ID: ${item.productId} não encontrado.`,
        HttpStatusCode.NOT_FOUND
      );

    const priceAtPurchase = parseFloat(product.price.toFixed(2));
    subtotal += product.price.toNumber() * item.quantity;

    orderItems.push({
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase,
    });
  }

  return { subtotal: parseFloat(subtotal.toFixed(2)), orderItems };
}
