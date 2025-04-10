import styles from "./DocumentForm.module.scss";
import { useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";

const DocumentForm = ({ onAddDocument }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
  });

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
      <Button type="submit">Cadastrar</Button>
    </form>
  );
};

export default DocumentForm;
