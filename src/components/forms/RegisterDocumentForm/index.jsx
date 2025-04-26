import { useForm } from "react-hook-form";
import styles from "./style.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./validator";
import { useContext, useState } from "react";
import { DocumentContext } from "../../../providers/DocumentContext";
import Button from "../../Button/Button";
import { Input } from "../Input";

export const RegisterDocumentForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const { documentRegister } = useContext(DocumentContext);

  const submit = (data) => {
    documentRegister(data, setLoading, reset);
  };
  return (
    <form onSubmit={handleSubmit(submit)}>
      <h2 className={styles.formTitle}>Cadastrar Documento</h2>
      <div className={styles.inputContainer}>
        <Input
          label="Nome"
          type="text"
          placeholder="Digite o nome do documento"
          disabled={loading}
          error={errors.documentName}
          {...register("documentName")}
        />
        <Input
          label="Descrição"
          type="text"
          placeholder="Descreva o documento aqui..."
          disabled={loading}
          error={errors.note}
          {...register("note")}
        />
        <Input
          label="Data de entrega"
          type="date"
          disabled={loading}
          error={errors.submissionDate}
          {...register("submissionDate")}
        />
      </div>
      <Button type="submit">Cadastrar</Button>
    </form>
  );
};
