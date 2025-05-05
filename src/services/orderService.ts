import prisma from "../config/database";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import { calculateDeliveryFee } from "../utils/deliveryUtils";
import {
  validateUserAndAddress,
  calculateOrderItems,
} from "../utils/orderUtils";

export async function getOrdersService(userId: string, role: string) {
  const orders =
    role === "ADMIN" || role === "MANAGER"
      ? await prisma.order.findMany({
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
      : await prisma.order.findMany({
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

  // 🔹 Agora formatamos os dados antes de retornar
  return orders.map((order) => ({
    orderId: order.id,
    client: order.userId,
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
    subtotal: parseFloat(order.subtotal.toFixed(2)),
    deliveryFee: parseFloat(order.deliveryFee.toFixed(2)),
    total: parseFloat(order.total.toFixed(2)),
    address: order.addressId,
  }));
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

  // 🔹 Estruturamos a resposta corretamente
  return {
    id: order.id,
    client: order.userId,
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
    subtotal: parseFloat(order.subtotal.toFixed(2)),
    deliveryFee: parseFloat(order.deliveryFee.toFixed(2)),
    total: parseFloat(order.total.toFixed(2)),
    address: order.address,
  };
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
              category: { select: { id: true, name: true } },
            },
          },
        },
      },
      address: {
        select: { id: true, street: true, city: true, state: true, zip: true },
      },
    },
  });

  // Agora formatamos a resposta antes de retornar ao controller
  return {
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
  };
}
