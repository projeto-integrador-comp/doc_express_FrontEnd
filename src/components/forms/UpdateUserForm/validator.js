import { z } from "zod";

export const schema = z
  .object({
    name: z
      .string()
      .max(120, "Máximo 120 caracteres")
      .min(2, "Mínimo 2 caracteres"),
    email: z
      .string()
      .max(120, "Máximo 120 caracteres")
      .email("Forneça um e-mail válido"),
    password: z
      .string()
      .refine((val) => val === "" || (val.length >= 6 && val.length <= 120), {
        message: "A senha deve ter entre 6 e 120 caracteres",
      })
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { password, confirmPassword } = data;

    const isPasswordFilled = password && password !== "";
    const isConfirmFilled = confirmPassword && confirmPassword !== "";

    if (isPasswordFilled && !isConfirmFilled) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "Confirme sua senha",
      });
    }

    if (isPasswordFilled && isConfirmFilled && password !== confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "As senhas não correspondem",
      });
    }
  });
