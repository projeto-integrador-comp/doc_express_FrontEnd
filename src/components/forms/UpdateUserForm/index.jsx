import { useForm } from "react-hook-form";
import styles from "./style.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./validator";
import { useContext, useState } from "react";
import { Input } from "../Input";
import Button from "../../Button/Button";
import { UserContext } from "../../../providers/UserContext";

export const UpdateUserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const { user, userUpdate } = useContext(UserContext);

  const submit = (data) => {
    if (data.email == user.email) delete data.email;
    if (data.password == "") delete data.password;
    if (data.confirmPassword == "") delete data.confirmPassword;

    userUpdate(data, setLoading, user.id);
  };
  return (
    <form onSubmit={handleSubmit(submit)}>
      <h2 className={styles.formTitle}>Atualizar Conta</h2>
      <div className={styles.inputContainer}>
        <Input
          label="Nome"
          type="text"
          placeholder="Digite o nome do documento"
          error={errors.name}
          disabled={loading}
          {...register("name")}
          defaultValue={user.name}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Digite aqui seu email"
          error={errors.email}
          disabled={loading}
          {...register("email")}
          defaultValue={user.email}
        />
        <Input
          label="Senha"
          type="password"
          placeholder="Digite aqui sua senha"
          error={errors.password}
          disabled={loading}
          {...register("password")}
        />
        <Input
          label="Confirmar senha"
          type="password"
          placeholder="Confirme aqui sua senha"
          error={errors.confirmPassword}
          disabled={loading}
          {...register("confirmPassword")}
        />
      </div>
      <Button type="submit">{loading ? "Atualizando..." : "Atualizar"}</Button>
    </form>
  );
};
