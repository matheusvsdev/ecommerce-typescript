import prisma from "../config/database";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import { calculateDeliveryFee } from "../utils/deliveryUtils";
import {
  validateUserAndAddress,
  calculateOrderItems,
} from "../utils/orderUtils";

export async function getOrdersService(userId: string, role: string) {
  if (role === "ADMIN" || role === "MANAGER") {
    return prisma.order.findMany({
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
    return prisma.order.findMany({
      where: { userId },
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
}

export async function getOrderByIdService(
  id: string,
  userId: string,
  role: string
) {
  const order =
    role === "ADMIN" || role === "MANAGER"
      ? await prisma.order.findUnique({
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
        })
      : await prisma.order.findUnique({
          where: { id, userId },
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

  if (!order)
    throw new AppError("Pedido não encontrado.", HttpStatusCode.NOT_FOUND);
  return order;
}

export async function createOrderService(
  userId: string,
  products: any[],
  addressId: string
) {
  await validateUserAndAddress(userId, addressId);
  const { subtotal, orderItems } = await calculateOrderItems(products);
  const deliveryFee = await calculateDeliveryFee(addressId, subtotal);
  const total = parseFloat((subtotal + deliveryFee).toFixed(2));

  return prisma.order.create({
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
        select: { id: true, street: true, city: true, state: true, zip: true },
      },
    },
  });
}
