import prisma from "../config/database";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../utils/HttpStatusCode";

const freightRatesByState: Record<string, number> = {
  AL: 10.0,
  PE: 15.0,
  BA: 18.0,
  SE: 20.0,
  SP: 30.0,
  RJ: 28.0,
};

export const calculateDeliveryFee = async (
  addressId: string,
  total: number
): Promise<number> => {
  if (total >= 100) return 0; // Frete grátis para pedidos acima de R$100

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address)
    throw new AppError("Endereço não encontrado.", HttpStatusCode.NOT_FOUND);

  const userState = address.state;

  if (!freightRatesByState[userState]) {
    throw new AppError(
      `Não realizamos entregas para o estado ${userState}.`,
      HttpStatusCode.BAD_REQUEST
    );
  }

  return freightRatesByState[userState];
};
