import { NextFunction, Request, Response } from "express";
import {
  getOrdersService,
  getOrderByIdService,
  createOrderService,
} from "../services/orderService";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = (req as any).user;
    const orders = await getOrdersService(userId, role);
    res.status(HttpStatusCode.OK).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = (req as any).user;
    const order = await getOrderByIdService(req.params.id, userId, role);
    res.status(HttpStatusCode.OK).json(order);
  } catch (error) {
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
    const order = await createOrderService(userId, products, addressId);
    res.status(HttpStatusCode.CREATED).json({ order });
  } catch (error) {
    next(error);
  }
};
