import { z } from "zod";

export const schema = z.object({
  submissionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Selecione uma data")
    .refine(
      (data) => {
        const date = new Date(data);
        return !isNaN(date.getTime());
      },
      { message: "Data Inválida." }
    )
    .transform((date) => new Date(date))
    .transform((date) => date.toISOString()),
  documentName: z
    .string()
    .max(50, "Máximo 50 caracteres")
    .min(2, "Mínimo 2 caracteres")
    .nonempty("O nome é obrigatório"),
  note: z.string().max(50, "Máximo 50 caracteres").default(""),
  delivered: z.boolean().default(false),
});
