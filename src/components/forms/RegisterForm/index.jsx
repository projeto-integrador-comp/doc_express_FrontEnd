import { useContext, useState } from "react";
import styles from "./style.module.scss";
import { UserContext } from "../../../providers/UserContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./validator";
import { Input } from "../Input";
import { Link } from "react-router-dom";

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const { userRegister } = useContext(UserContext);

  const submit = (data) => {
    userRegister(data, setLoading, reset);
  };
  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className={styles.formBox}>
        <h2 className="title textCenter">Cadastro</h2>
        <Input
          label="Nome"
          type="text"
          placeholder="Digite aqui seu nome"
          error={errors.name}
          disabled={loading}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Digite aqui seu email"
          error={errors.email}
          disabled={loading}
          {...register("email")}
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
        <button type="submit" className="btn">
          Cadastrar
        </button>

        <Link to={"/"}>
          <button className="btn transparent">Votar para o login</button>
        </Link>
      </div>
    </form>
  );
};
