import { NextFunction, Request, Response } from "express";
import prisma from "../config/database";
import { calculateDeliveryFee } from "../utils/deliveryUtils";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import { AppError } from "../utils/AppError";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, products, addressId } = req.body;

  try {
    let subtotal = 0;
    const orderItems = [];

    // Calcular subtotal baseado nos produtos
    for (const item of products) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        throw new AppError(
          `Produto com ID: ${item.productId} não encontrado.`,
          HttpStatusCode.NOT_FOUND
        );
      }

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: parseFloat(product.price.toFixed(2)), // Salvar preço no momento da compra
      });

      subtotal += product.price.toNumber() * item.quantity; // Agora soma corretamente os valores
    }

    // Calcular taxa de entrega com tratamento de erro
    let deliveryFee = 0;
    try {
      deliveryFee = await calculateDeliveryFee(addressId, subtotal);
      if (isNaN(deliveryFee)) throw new Error("Erro no cálculo do frete.");
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      res.status(500).json({ error: "Erro ao calcular frete." });
      return;
    }

    // Garantir duas casas decimais
    subtotal = parseFloat(subtotal.toFixed(2));
    deliveryFee = parseFloat(deliveryFee.toFixed(2));
    const total = parseFloat((subtotal + deliveryFee).toFixed(2));

    // Criar o pedido
    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        address: { connect: { id: addressId } },
        products: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
          })),
        },
        subtotal,
        deliveryFee,
        total,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        address: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            zip: true,
          },
        },
      },
    });

    // Retornar resposta incluindo subtotal, frete e total
    res.status(201).json({
      order: {
        id: order.id,
        client: order.user,
        items: order.products.map((item) => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            price: parseFloat(item.product.price.toFixed(2)),
            category: item.product.category, // ✅ Agora categoria está visível como um objeto
          },
          quantity: item.quantity,
          priceAtPurchase: parseFloat(item.priceAtPurchase.toFixed(2)),
        })),
        subtotal,
        deliveryFee,
        total,
        address: order.address,
      },
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    next();
  }
};
