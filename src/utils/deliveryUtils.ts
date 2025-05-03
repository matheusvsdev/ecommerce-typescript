import prisma from "../config/database";

const freightRatesByState: Record<string, number> = {
  AL: 10.0, // Alagoas (empresa local, frete mais barato)
  PE: 15.0, // Pernambuco
  BA: 18.0, // Bahia
  SE: 20.0, // Sergipe
  SP: 30.0, // São Paulo (mais distante)
  RJ: 28.0, // Rio de Janeiro
};

export const calculateDeliveryFee = async (
  addressId: string,
  total: number // Adicionamos o total do pedido
): Promise<number> => {
  if (total >= 100) {
    return 0; // Frete grátis para pedidos acima de R$100
  }

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address) throw new Error("Endereço não encontrado.");

  const userState = address.state; // Obtém o estado do usuário
  console.log("Estado do usuário:", userState);

  if (!(userState in freightRatesByState)) {
    throw new Error(`Não realizamos entregas para o estado ${userState}.`);
  }

  return freightRatesByState[userState];
};
