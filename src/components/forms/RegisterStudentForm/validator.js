import { z } from "zod";

export const studentSchema = z.object({
  name: z
    .string()
    .max(120, "Máximo 120 caracteres")
    .min(2, "Mínimo 2 caracteres")
    .nonempty("O nome do aluno é obrigatório"),
  classroomId: z
    .string()
    .uuid("Selecione uma turma válida")
    .nonempty("A turma é obrigatória"),
});