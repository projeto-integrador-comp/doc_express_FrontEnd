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
      setValue("role", user.role); // Agora o cargo deve ser recuperado corretamente
    }
  }, [user, setValue]);

  const submit = async (data) => {
  try {
    const token = localStorage.getItem("@tokenDocExpress");
    const headers = { Authorization: `Bearer ${token}` };

    if (user) {
      // MODO EDIÇÃO: Enviamos apenas nome e cargo
      const payload = { 
        name: data.name, 
        role: data.role 
      };
      await api.patch(`/users/${user.id}`, payload, { headers });
      alert("Usuário atualizado com sucesso!");
    } else {
      // MODO CADASTRO: Payload completo (incluindo email e password)
      await api.post("/users", data, { headers });
      alert("Usuário cadastrado com sucesso!");
    }
    onClose();
  } catch (error) {
    console.error("Erro detalhado:", error.response?.data);
    alert("Erro ao salvar alterações.");
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
          {/* Campo Nome - Sempre visível */}
          <div className={styles.inputGroup}>
            <label>Nome <span className={styles.requiredAsterisk}>*</span></label>
            <input {...register("name", { required: true })} />
          </div>

          {/* Campo Email - SÓ APARECE SE NÃO FOR EDIÇÃO */}
          {!user && (
            <div className={styles.inputGroup}>
              <label>Email <span className={styles.requiredAsterisk}>*</span></label>
              <input
                type="email"
                {...register("email", { required: !user })}
                placeholder="exemplo@email.com"
              />
            </div>
          )}

          {/* Campo Cargo - Sempre visível */}
          <div className={styles.inputGroup}>
            <label>Cargo <span className={styles.requiredAsterisk}>*</span></label>
            <select {...register("role", { required: true })}>
              <option value="">Selecione o cargo</option>
              <option value="ADMIN">Administrador</option>
              <option value="TEACHER">Professor</option>
              <option value="MONITOR">Monitor</option>
            </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            {user ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
};