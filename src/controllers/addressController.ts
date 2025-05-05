import { NextFunction, Request, Response } from "express";
import { addressSchema } from "../validations/addressValidations";
import {
  getAddressesService,
  getAddressByIdService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
} from "../services/addressService";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export const getAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = (req as any).user;
    const addresses = await getAddressesService(userId, role);
    res.status(HttpStatusCode.OK).json(addresses);
  } catch (error) {
    next(error);
  }
};

export const getAddressById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = (req as any).user;
    const address = await getAddressByIdService(req.params.id, userId, role);
    res.status(HttpStatusCode.OK).json(address);
  } catch (error) {
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
    const newAddress = await createAddressService(
      zip,
      state,
      city,
      street,
      userId
    );
    res.status(HttpStatusCode.CREATED).json(newAddress);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(
        new AppError(
          error.errors.map((err) => err.message).join(", "),
          HttpStatusCode.UNPROCESSABLE_ENTITY
        )
      );
    }
    next(error);
  }
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    addressSchema.parse(req.body);
    const { zip, state, city, street } = req.body;
    const updatedAddress = await updateAddressService(
      req.params.id,
      zip,
      state,
      city,
      street
    );
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
  try {
    const response = await deleteAddressService(req.params.id);
    res.status(HttpStatusCode.OK).json(response);
  } catch (error) {
    next(error);
  }
};
