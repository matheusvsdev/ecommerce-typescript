import { NextFunction, Request, Response } from "express";
import prisma from "../config/database";
import { addressSchema } from "../validations/addressValidations";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export const getAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = (req as any).user; // Pegando `userId` e `role` do usuário autenticado

    let addresses;

    if (role === "ADMIN" || role === "MANAGER") {
      // ADMIN e MANAGER veem todos os endereços
      addresses = await prisma.address.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      });
    } else {
      // Usuário comum vê apenas seus endereços
      addresses = await prisma.address.findMany({
        where: { userId }, // Filtra apenas endereços do usuário logado
        include: { user: { select: { id: true, name: true, email: true } } },
      });
    }

    res.status(HttpStatusCode.OK).json(addresses);
  } catch (error) {
    console.error("[ERROR] Falha ao buscar endereços:", error);
    next(error);
  }
};

export const getAddressById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { userId, role } = (req as any).user; // Pegando `userId` e `role`

  try {
    let address;

    if (role === "ADMIN" || role === "MANAGER") {
      // ADMIN e MANAGER podem acessar qualquer endereço
      address = await prisma.address.findUnique({
        where: { id },
        include: { user: { select: { id: true, name: true, email: true } } },
      });
    } else {
      // Usuário comum só pode ver seus próprios endereços
      address = await prisma.address.findUnique({
        where: { id, userId }, // Filtra pelo ID e usuário logado
        include: { user: { select: { id: true, name: true, email: true } } },
      });
    }

    if (!address) {
      return next(
        new AppError("Endereço não encontrado.", HttpStatusCode.NOT_FOUND)
      );
    }

    res.status(HttpStatusCode.OK).json(address);
  } catch (error) {
    console.error("[ERROR] Falha ao buscar endereço:", error);
    next(error);
  }
};

export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    addressSchema.parse(req.body);
    const { zip, state, city, street, userId } = req.body;

    // Verificar se o usuário existe antes de associar o endereço
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return next(
        new AppError("Usuário não encontrado.", HttpStatusCode.NOT_FOUND)
      );
    }

    const address = await prisma.address.create({
      data: { zip, state, city, street, userId },
    });
    res.status(HttpStatusCode.CREATED).json(address);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  addressSchema.parse(req.body);
  const { zip, state, city, street } = req.body;

  try {
    const addressExists = await prisma.address.findUnique({ where: { id } });
    if (!addressExists) {
      return next(
        new AppError("Endereço não encontrado.", HttpStatusCode.NOT_FOUND)
      );
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: { zip, state, city, street },
    });
    res.status(HttpStatusCode.OK).json(updatedAddress);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const addressExists = await prisma.address.findUnique({ where: { id } });
    if (!addressExists) {
      return next(
        new AppError("Endereço não encontrado.", HttpStatusCode.NOT_FOUND)
      );
    }

    await prisma.address.delete({ where: { id } });
    res
      .status(HttpStatusCode.OK)
      .json({ message: "Endereço removido com sucesso." });
  } catch (error) {
    next(error);
  }
};
