import { NextFunction, Request, Response } from "express";
import prisma from "../config/database";
import { calculateDeliveryFee } from "../utils/deliveryUtils";
import {
  validateUserAndAddress,
  calculateOrderItems,
} from "../utils/orderUtils";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import { AppError } from "../utils/AppError";

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = (req as any).user;

    let orders;

    if (role === "ADMIN" || role === "MANAGER") {
      // ADMIN e MANAGER veem todos os pedidos
      orders = await prisma.order.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  category: { select: { id: true, name: true } },
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
    } else {
      // 🔹 Usuário comum vê apenas seus pedidos
      orders = await prisma.order.findMany({
        where: { userId }, // 🔹 Filtra pedidos pelo ID do usuário logado
        include: {
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  category: { select: { id: true, name: true } },
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
    }

    res.status(HttpStatusCode.OK).json(orders);
  } catch (error) {
    console.error("[ERROR] Falha ao listar pedidos:", error);
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { userId, role } = (req as any).user;

  try {
    let order;

    if (role === "ADMIN" || role === "MANAGER") {
      // ADMIN e MANAGER podem ver qualquer pedido
      order = await prisma.order.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  category: { select: { id: true, name: true } },
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
    } else {
      // Usuário comum só vê pedidos dele
      order = await prisma.order.findUnique({
        where: { id, userId }, // Filtra pelo pedido e usuário logado
        include: {
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  category: { select: { id: true, name: true } },
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
    }

    if (!order) {
      return next(
        new AppError("Pedido não encontrado.", HttpStatusCode.NOT_FOUND)
      );
    }

    res.status(HttpStatusCode.OK).json(order);
  } catch (error) {
    console.error("[ERROR] Falha ao buscar pedido:", error);
    next(error);
  }
};

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, products, addressId } = req.body;

    await validateUserAndAddress(userId, addressId);

    const { subtotal, orderItems } = await calculateOrderItems(products);

    let deliveryFee;
    try {
      deliveryFee = await calculateDeliveryFee(addressId, subtotal);
      if (isNaN(deliveryFee)) throw new Error();
    } catch {
      return next(
        new AppError(
          "Erro ao calcular frete.",
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
    }

    const total = parseFloat((subtotal + deliveryFee).toFixed(2));

    const order = await prisma.order.create({
      data: {
        userId,
        addressId,
        subtotal,
        deliveryFee,
        total,
        products: { create: orderItems },
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
                category: { select: { name: true } },
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

    res.status(HttpStatusCode.CREATED).json({
      order: {
        id: order.id,
        client: order.user,
        items: order.products.map((item) => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            price: parseFloat(item.product.price.toFixed(2)),
            category: item.product.category,
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
    console.error("[ERROR] Falha ao criar pedido:", error);
    next(error);
  }
};
