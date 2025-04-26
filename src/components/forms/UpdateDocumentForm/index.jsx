import { useForm } from "react-hook-form";
import styles from "./style.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./validator";
import { useContext, useState } from "react";
import { DocumentContext } from "../../../providers/DocumentContext";
import Button from "../../Button/Button";
import { Input } from "../Input";

export const UpdateDocumentForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const { editingDocument, documentUpdate } = useContext(DocumentContext);

  const submit = (data) => {
    documentUpdate(data, setLoading, editingDocument.id);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <h2 className={styles.formTitle}>Editar Documento</h2>
      <div className={styles.inputContainer}>
        <Input
          label="Nome"
          type="text"
          placeholder="Digite o nome do documento"
          disabled={loading}
          error={errors.documentName}
          {...register("documentName")}
          defaultValue={editingDocument.documentName}
        />
        <Input
          label="Descrição"
          type="text"
          placeholder="Descreva o documento aqui..."
          disabled={loading}
          error={errors.note}
          {...register("note")}
          defaultValue={editingDocument.note}
        />
        <Input
          label="Data de entrega"
          type="date"
          disabled={loading}
          error={errors.submissionDate}
          {...register("submissionDate")}
          defaultValue={editingDocument.submissionDate}
        />
      </div>
      <Button type="submit">Editar</Button>
    </form>
  );
};
