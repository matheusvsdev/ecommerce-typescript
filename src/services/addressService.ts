import prisma from "../config/database";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export async function getAddressesService(userId: string, role: string) {
  return role === "ADMIN" || role === "MANAGER"
    ? prisma.address.findMany({
        include: { user: { select: { id: true, name: true, email: true } } },
      })
    : prisma.address.findMany({
        where: { userId },
        include: { user: { select: { id: true, name: true, email: true } } },
      });
}

export async function getAddressByIdService(
  id: string,
  userId: string,
  role: string
) {
  const address =
    role === "ADMIN" || role === "MANAGER"
      ? await prisma.address.findUnique({
          where: { id },
          include: { user: { select: { id: true, name: true, email: true } } },
        })
      : await prisma.address.findUnique({
          where: { id, userId },
          include: { user: { select: { id: true, name: true, email: true } } },
        });

  if (!address)
    throw new AppError("Endereço não encontrado.", HttpStatusCode.NOT_FOUND);
  return address;
}

export async function createAddressService(
  zip: string,
  state: string,
  city: string,
  street: string,
  userId: string
) {
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists)
    throw new AppError("Usuário não encontrado.", HttpStatusCode.NOT_FOUND);

  return prisma.address.create({ data: { zip, state, city, street, userId } });
}

export async function updateAddressService(
  id: string,
  zip: string,
  state: string,
  city: string,
  street: string
) {
  const addressExists = await prisma.address.findUnique({ where: { id } });
  if (!addressExists)
    throw new AppError("Endereço não encontrado.", HttpStatusCode.NOT_FOUND);

  return prisma.address.update({
    where: { id },
    data: { zip, state, city, street },
  });
}

export async function deleteAddressService(id: string) {
  const addressExists = await prisma.address.findUnique({ where: { id } });
  if (!addressExists)
    throw new AppError("Endereço não encontrado.", HttpStatusCode.NOT_FOUND);

  await prisma.address.delete({ where: { id } });
  return {
    success: true,
    status: "200 OK",
    message: "Endereço removido com sucesso.",
  };
}
