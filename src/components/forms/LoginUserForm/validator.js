import { z } from "zod";

export const schema = z.object({
  email: z.string().email("Forneça um email válido"),
  password: z.string().nonempty("O campo senha é obrigatório"),
});
