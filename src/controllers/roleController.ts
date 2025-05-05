import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export const getRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await prisma.role.findMany();
    res.status(HttpStatusCode.OK).json(roles);
  } catch (error) {
    next(error);
  }
};
