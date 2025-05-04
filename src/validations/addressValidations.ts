import { z } from "zod";

export const userSchema = z.object({
  zip: z.string().length(8, "CEP deve ter exatamente 8 caracteres"),
  state: z.string().length(2, "Estado deve ser uma sigla de 2 caracteres"),
  city: z.string().min(1, "Campo cidade não pode ser vazio"),
  street: z.string().min(1, "Campo rua não pode ser vazio"),
  userId: z.string().uuid("Category ID inválido"),
});
