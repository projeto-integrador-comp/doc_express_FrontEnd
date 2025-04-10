import styles from "./DocumentForm.module.scss";
import { useEffect, useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";

const DocumentForm = ({ onAddDocument, existingData }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    if (existingData) {
      setForm(existingData);
    } else {
      setForm({ name: "", description: "", date: "" });
    }
  }, [existingData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name) {
      onAddDocument({ ...form, checked: false });
      setForm({ name: "", description: "", date: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>
        {existingData ? "Editar Documento" : "Cadastrar Documento"}
      </h2>

      <div className={styles.inputContainer}>
        <Input
          label="Nome"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Digite o nome do documento"
        />
        <label className={styles.label} htmlFor="description">
          Descrição
        </label>
        <textarea
          label="Descrição"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descreva o documento aqui..."
        />
        {/* <div className={styles.dateContainer}> */}
        <Input
          label="Data de entrega"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">
        {existingData ? "Salvar Alterações" : "Cadastrar"}
      </Button>
    </form>
  );
};

export default DocumentForm;
