import { NextFunction, Request, Response } from "express";
import prisma from "../config/database";
import { calculateDeliveryFee } from "../utils/deliveryUtils";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, products, addressId } = req.body;

  try {
    let subTotal = 0;
    const orderItems = [];

    for (const item of products) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        res
          .status(404)
          .json({ error: `Produto ID ${item.productId} não encontrado.` });
        return;
      }

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: parseFloat(product.price.toFixed(2)), // Salvar preço no momento da compra
      });

      subTotal += product.price.toNumber() * item.quantity; // Agora soma corretamente os valores
    }

    // Calcular taxa de entrega com tratamento de erro
    let deliveryFee = 0;
    try {
      deliveryFee = await calculateDeliveryFee(addressId, subTotal);
      if (isNaN(deliveryFee)) throw new Error("Erro no cálculo do frete.");
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      res.status(500).json({ error: "Erro ao calcular frete." });
      return;
    }

    // Garantir duas casas decimais
    subTotal = parseFloat(subTotal.toFixed(2));
    deliveryFee = parseFloat(deliveryFee.toFixed(2));
    const total = parseFloat((subTotal + deliveryFee).toFixed(2));

    // Criar a entrega separadamente primeiro
    const delivery = await prisma.delivery.create({
      data: {
        address: { connect: { id: addressId } },
        fee: parseFloat(deliveryFee.toFixed(2)),
      },
    });

    // Criar o pedido conectando a entrega corretamente
    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        products: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
          })),
        },
        total, // Salva apenas o total no banco
        delivery: { connect: { id: delivery.id } }, // Vincula corretamente a entrega
      },
    });

    // Retornar resposta incluindo subtotal, frete e total
    res.status(201).json({
      order: {
        ...order,
        total: parseFloat(order.total.toFixed(2)), // Converte para número
      },
      subTotal, // Exibir subtotal calculado
      deliveryFee, // Exibir frete calculado
      total, // Exibir total final
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    next();
  }
};
