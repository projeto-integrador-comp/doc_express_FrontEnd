import { useContext } from "react";
import { useForm } from "react-hook-form";
import { StudentContext } from "../../../providers/StudentContext";
import styles from "./style.module.scss"; 

export const UpdateStudentModal = () => {
  const { updatingStudent, setUpdatingStudent, studentUpdate, classrooms, loading } = useContext(StudentContext);

  const { register, handleSubmit } = useForm({
    values: {
      name: updatingStudent?.name,
      classroomId: updatingStudent?.classroomId,
    }
  });

  const submit = (data) => {
    studentUpdate(data, updatingStudent.id);
  };

  if (!updatingStudent) return null;

  return (
  <div className={styles.modalOverlay} role="dialog">
    <div className={styles.modalBox}>
      <header className={styles.header}>
        <h2 className="title three">Atualizar Aluno</h2>
        {/* Botão X no topo */}
        <button className={styles.closeBtn} onClick={() => setUpdatingStudent(null)} type="button">X</button>
      </header>

      <form onSubmit={handleSubmit(submit)} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>NOME DO ALUNO</label>
          <input 
            type="text" 
            {...register("name")} 
            placeholder="Digite o nome..." 
          />
        </div>

        <div className={styles.inputGroup}>
          <label>TURMA</label>
          <select {...register("classroomId")}>
            <option value="">Selecione uma turma</option>
            {classrooms?.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
          </button>
          
          {/* Botão Cancelar idêntico ao "Fechar" da sua imagem de referência */}
          <button 
            type="button" 
            className={styles.cancelBtn} 
            onClick={() => setUpdatingStudent(null)}
          >
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  </div>
);
};