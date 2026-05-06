import styles from "./style.module.scss";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { api } from "../../../services/api";

export const RegisterClassroomModal = ({ classroom, teachers, onClose, setClassrooms }) => {
  // Debug para confirmar se a lista chegou
  console.log("Professores disponíveis no modal:", teachers); 

  const isEditing = !!classroom;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    // ... seu defaultValues atual
  });

  // 2. useEffect para garantir que os campos atualizem se o modal abrir/fechar
  useEffect(() => {
    if (classroom) {
      setValue("name", classroom.name);

      // O pulo do gato: Verifique se o professor existe e passe o ID dele
      if (classroom.teacher && classroom.teacher.id) {
        setValue("teacherId", classroom.teacher.id);
      }
    } else {
      // Limpa os campos ao cadastrar nova turma
      setValue("name", "");
      setValue("teacherId", "");
    }
  }, [classroom, setValue]);

  // 2. Envio correto no submit
  const submit = async (data) => {
    try {
      const token = localStorage.getItem("@tokenDocExpress");

      // Garantimos que o payload envie o teacherId para a FK do banco
      const payload = {
        name: data.name,
        teacherId: data.teacherId // Deve ser o UUID do professor selecionado
      };

      if (classroom) {
        await api.patch(`/classrooms/${classroom.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Turma atualizada!");
      } else {
        await api.post("/classrooms", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Turma criada!");
      }
      onClose();
    } catch (error) {
      console.error(error.response?.data);
      alert("Erro ao salvar turma.");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog">
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          {/* Agora o isEditing funciona! */}
          <h2>{isEditing ? "Editar Turma" : "Cadastrar Nova Turma"}</h2>
          <button type="button" className={styles.closeButton} onClick={onClose}>X</button>
        </div>

        <form onSubmit={handleSubmit(submit)}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">
              Nome da Turma <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
              type="text"
              id="name"
              placeholder="Ex: 3º Ano A"
              {...register("name", { required: "O nome é obrigatório" })}
            />
            {errors.name && <span className={styles.error}>{errors.name.message}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="teacherId">
              Professor Responsável <span className={styles.requiredAsterisk}>*</span>
            </label>
            <select id="teacherId" {...register("teacherId", { required: true })}>
              <option value="">Selecione um professor</option>
              {teachers?.map((t) => (
                <option key={t.id} value={t.id}> {/* O value DEVE ser o ID */}
                  {t.name}
                </option>
              ))}
            </select>
            {errors.teacherId && <span className={styles.error}>{errors.teacherId.message}</span>}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              {isEditing ? "Salvar Alterações" : "Confirmar Cadastro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};