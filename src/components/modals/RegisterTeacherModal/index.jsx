import styles from "./style.module.scss";
import { useForm } from "react-hook-form";
import { api } from "../../../services/api";
import { useEffect } from "react";

// 1. Receba a prop 'user' que enviamos lá da página de gestão
export const RegisterTeacherModal = ({ onClose, user }) => {
  // Adicionamos o 'setValue' para preencher o formulário programaticamente
  const { register, handleSubmit, setValue } = useForm();

  // 2. useEffect para carregar os dados se o 'user' existir (Modo Edição)
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("role", user.role?.toUpperCase());
      // Senha geralmente não se preenche na edição por segurança
    }
  }, [user, setValue]);

  const submit = async (data) => {
  try {
    const token = localStorage.getItem("@tokenDocExpress");

    if (user) {
      // O BACKEND REJEITA O CAMPO 'role' NO PATCH
      // Criamos um novo objeto APENAS com o que é permitido
      const payload = {
        name: data.name,
        email: data.email
      };

      // Se houver senha, adicionamos
      if (data.password) payload.password = data.password;

      console.log("Enviando Payload para PATCH:", payload); // Verifique se o 'role' não está aqui!

      await api.patch(`/users/${user.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Atualizado com sucesso!");
    } else {
      // No POST o role é aceito
      await api.post("/users", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Cadastrado com sucesso!");
    }
    onClose();
  } catch (error) {
    console.error("Erro real do backend:", error.response?.data);
  }
};

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog">
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          {/* 3. Título Dinâmico */}
          <h2>{user ? "Editar Professor ou Monitor" : "Cadastrar Professor ou Monitor"}</h2>
          <button type="button" className={styles.closeButton} onClick={onClose}>X</button>
        </div>

        <form onSubmit={handleSubmit(submit)}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome Completo <span className={styles.requiredAsterisk}>*</span></label>
            <input type="text" id="name" {...register("name", { required: true })} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail <span className={styles.requiredAsterisk}>*</span></label>
            <input type="email" id="email" {...register("email", { required: true })} />
          </div>

          {/* 4. Senha só é obrigatória no cadastro */}
          {!user && (
            <div className={styles.inputGroup}>
              <label htmlFor="password">Senha Provisória <span className={styles.requiredAsterisk}>*</span></label>
              <input type="password" id="password" {...register("password", { required: true })} />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="role">Cargo <span className={styles.requiredAsterisk}>*</span></label>
            <select id="role" {...register("role", { required: true })}>
              <option value="">Selecione o perfil</option>
              <option value="TEACHER">Professor</option>
              <option value="MONITOR">Monitor</option>
            </select>
          </div>

          <p className={styles.formNote}><span className={styles.requiredAsterisk}>*</span> Campos obrigatórios.</p>

          <button type="submit" className={styles.submitButton}>
            {user ? "Salvar Alterações" : "Finalizar Cadastro"}
          </button>
        </form>
      </div>
    </div>
  );
};