import styles from "./style.module.scss";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { api } from "../../../services/api"; 

export const RegisterClassroomModal = ({ onClose, classroom = null }) => {
  const isEditing = !!classroom;
  
  // O useForm inicia com os valores da turma caso esteja editando
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: classroom ? {
      name: classroom.name,
      teacherId: classroom.teacherId
    } : {}
  });

  const [teachers, setTeachers] = useState([]);

  // Busca professores cadastrados para preencher o select
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const token = localStorage.getItem("@tokenDocExpress");
        const response = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Filtra para mostrar apenas usuários com role TEACHER
        // Importante: use o valor exato que o seu backend espera (TEACHER ou admin)
        const onlyTeachers = response.data.filter(user => 
          user.role === "TEACHER" || user.role === "admin"
        );
        setTeachers(onlyTeachers);
      } catch (error) {
        console.error("Erro ao carregar professores:", error);
      }
    };
    loadTeachers();
  }, []);

  const submit = async (data) => {
    try {
      const token = localStorage.getItem("@tokenDocExpress");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const payload = {
        name: data.name,
        teacherId: data.teacherId,
        monitorIds: classroom?.monitorIds || []
      };

      if (isEditing) {
        // Rota de PATCH para atualização parcial
        await api.patch(`/classrooms/${classroom.id}`, payload, config);
        alert("Turma atualizada com sucesso!");
      } else {
        // Rota de POST para criação
        await api.post("/classrooms", payload, config);
        alert("Turma cadastrada com sucesso!");
      }

      onClose();
    } catch (error) {
      console.error("Erro na operação:", error.response?.data || error.message);
      alert("Ocorreu um erro ao processar a requisição. Verifique os dados.");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog">
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
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
              {...register("name", { required: true, minLength: 1, maxLength: 120 })} 
            />
            {errors.name && <span className={styles.error}>Nome é obrigatório (máx 120 caracteres)</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="teacherId">
              Professor Responsável <span className={styles.requiredAsterisk}>*</span>
            </label>
            <select id="teacherId" {...register("teacherId", { required: true })}>
              <option value="">Selecione um professor</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            {errors.teacherId && <span className={styles.error}>Selecione um professor responsável</span>}
          </div>

          <p className={styles.formNote}>
            <span className={styles.requiredAsterisk}>*</span> Campos de preenchimento obrigatório.
          </p>

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