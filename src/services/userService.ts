import bcrypt from "bcryptjs";
import prisma from "../config/database";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export async function getUsersService() {
  return prisma.user.findMany({ include: { role: true } });
}

export async function createUserService(
  name: string,
  email: string,
  password: string,
  roleId: string
) {
  const emailExists = await prisma.user.findUnique({ where: { email } });
  if (emailExists)
    throw new AppError("Email já está em uso.", HttpStatusCode.CONFLICT);

  if (!roleId)
    throw new AppError("Role ID é obrigatório.", HttpStatusCode.BAD_REQUEST);

  const roleExists = await prisma.role.findUnique({ where: { id: roleId } });
  if (!roleExists)
    throw new AppError("Role ID não encontrado.", HttpStatusCode.NOT_FOUND);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, roleId },
    include: { role: true },
  });

  // Remover senha da resposta
  const { password: _, roleId: __, ...userWithoutSensitiveData } = user;
  return userWithoutSensitiveData;
}
