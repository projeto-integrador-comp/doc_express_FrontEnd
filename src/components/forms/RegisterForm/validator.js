import { z } from "zod";

export const schema = z
  .object({
    name: z
      .string()
      .max(120, "Máximo 120 caracteres")
      .min(2, "Mínimo 2 caracteres")
      .nonempty("O nome é obrigatório"),
    email: z
      .string()
      .max(120, "Máximo 120 caracteres")
      .email("Forneça um e-mail válido")
      .nonempty("O email é obrigatório"),
    password: z
      .string()
      .max(120, "Máximo de 120 caracteres")
      .min(6, "Mínimo de 6 caracteres")
      .nonempty("O campo senha é obrigatório"),
    confirmPassword: z.string().nonempty("Confirme sua senha"),
    admin: z.boolean().default(false),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "As senhas não correspondem",
    path: ["confirmPassword"],
  });
