import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  price: z.number().min(0, "Preço deve ser maior ou igual a zero"),
  categoryId: z.string().uuid("Category ID inválido"),
});
