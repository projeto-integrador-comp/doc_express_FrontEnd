import { useContext, useState } from "react";
import styles from "./style.module.scss";
import { UserContext } from "../../../providers/UserContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./validator";
import { Input } from "../Input";
import loadingImg from "../../../assets/loading.svg";

// Adicionamos a prop 'onSuccess' para fechar o modal
export const RegisterUserForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  const { adminRegisterUser } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const submit = async (data) => {
    // Criamos um novo reset que limpa o form E fecha o modal
    const customReset = () => {
      reset();
      if (onSuccess) onSuccess(); // Fecha o modal
    };

    adminRegisterUser(data, setLoading, customReset);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className={styles.formContent}>
      {/* Removemos o <h2> daqui, pois o título agora fica no Header do Modal */}
      
      <Input
        label="Nome"
        type="text"
        placeholder="Nome completo"
        error={errors.name}
        disabled={loading}
        {...register("name")}
      />
      
      <Input
        label="Email"
        type="email"
        placeholder="Email profissional"
        error={errors.email}
        disabled={loading}
        {...register("email")}
      />

      <div className={styles.selectContainer}>
        <label className="label">Cargo / Permissão</label>
        <select 
          {...register("role")} 
          className={styles.selectInput}
          disabled={loading}
        >
          <option value="MONITOR">Monitor</option>
          <option value="TEACHER">Professor</option>
          <option value="ADMIN">Administrador</option>
        </select>
        {errors.role && <p className={styles.error}>{errors.role.message}</p>}
      </div>

      <Input
        label="Senha"
        type="password"
        placeholder="Senha temporária"
        error={errors.password}
        disabled={loading}
        {...register("password")}
      />
      
      <Input
        label="Confirmar senha"
        type="password"
        placeholder="Confirme a senha"
        error={errors.confirmPassword}
        disabled={loading}
        {...register("confirmPassword")}
      />

      <div className={styles.registerBox} style={{ marginTop: '20px' }}>
        <button type="submit" className="btn primary big" disabled={loading}>
          {loading ? <img src={loadingImg} alt="Carregando..." /> : "CADASTRAR COLABORADOR"}
        </button>
      </div>
    </form>
  );
};