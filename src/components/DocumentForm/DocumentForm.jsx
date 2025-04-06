import styles from "./DocumentForm.module.scss";
import { useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";

const DocumentForm = ({ onAddDocument }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
    notifyAt: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name) {
      onAddDocument({ ...form, checked: false });
      setForm({ name: "", description: "", date: "", notifyAt: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label="Nome do documento"
        name="name"
        value={form.name}
        onChange={handleChange}
      />
      <textarea
        label="Descrição"
        name="description"
        value={form.description}
        onChange={handleChange}
      />
      {/* <div className={styles.dateContainer}> */}
      <Input
        label="Data de entrega"
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
      />
      {/* <Input
          label="Notificar em"
          name="notifyAt"
          type="date"
          value={form.notifyAt}
          onChange={handleChange}
        /> */}
      {/* </div> */}
      <Button type="submit">Cadastrar</Button>
    </form>
  );
};

export default DocumentForm;
