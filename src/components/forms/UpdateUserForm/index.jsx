import { useForm } from "react-hook-form";
import styles from "./style.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./validator";
import { useContext, useEffect } from "react"; // Adicionado useEffect
import { Input } from "../Input";
import Button from "../../Button/Button";
import { UserContext } from "../../../providers/UserContext";

export const UpdateUserForm = () => {
  // Pegamos o 'updatingUser' (o alvo da edição) em vez do 'user' (você)
  const { updatingUser, userUpdate, loading } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    reset, // Adicionado para atualizar os campos dinamicamente
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    // Valores iniciais vindos do colaborador selecionado
    defaultValues: {
      name: updatingUser?.name,
      email: updatingUser?.email,
    }
  });

  // Esse efeito garante que o formulário mude os dados se você clicar em outro colaborador
  useEffect(() => {
    if (updatingUser) {
      reset({
        name: updatingUser.name,
        email: updatingUser.email,
        password: "",
        confirmPassword: ""
      });
    }
  }, [updatingUser, reset]);

  const submit = (data) => {
    // Limpeza de campos opcionais
    if (data.email === updatingUser.email) delete data.email;
    if (!data.password) {
        delete data.password;
        delete data.confirmPassword;
    }

    // Enviamos o ID do colaborador selecionado (updatingUser.id)
    userUpdate(data, updatingUser.id);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      {/* Removi o <h2> daqui pois o título já está no Header do Modal */}
      <div className={styles.inputContainer}>
        <Input
          label="Nome"
          type="text"
          placeholder="Nome do colaborador"
          error={errors.name}
          disabled={loading}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Email do colaborador"
          error={errors.email}
          disabled={loading}
          {...register("email")}
        />
        <Input
          label="Nova Senha"
          type="password"
          placeholder="Digite se desejar alterar"
          error={errors.password}
          disabled={loading}
          {...register("password")}
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          placeholder="Confirme a nova senha"
          error={errors.confirmPassword}
          disabled={loading}
          {...register("confirmPassword")}
        />
      </div>
      <Button type="submit">
        {loading ? "Atualizando..." : "Atualizar Colaborador"}
      </Button>
    </form>
  );
};