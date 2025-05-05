import { NextFunction, Request, Response } from "express";
import { getUsersService, createUserService } from "../services/userService";
import { userSchema } from "../validations/userValidation";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getUsersService();
    res.status(HttpStatusCode.OK).json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    userSchema.parse(req.body);
    const { name, email, password, roleId } = req.body;

    const newUser = await createUserService(name, email, password, roleId);
    res.status(HttpStatusCode.CREATED).json({
      success: true,
      status: "201 Created",
      message: "Usuário criado com sucesso.",
      data: newUser,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
