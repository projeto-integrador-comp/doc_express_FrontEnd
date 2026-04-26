import { useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentContext } from "../../../providers/StudentContext";
import { studentSchema } from "./validator"; 
import { Input } from "../Input";
import styles from "./style.module.scss";
import loadingImg from "../../../assets/loading.svg";

// Adicionamos a prop 'onSuccess' para receber a função de fechar o modal
export const RegisterStudentForm = ({ onSuccess }) => {
  const { classrooms, studentRegister, loading } = useContext(StudentContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(studentSchema),
  });

  const submit = (data) => {
    // Criamos um callback que limpa o form e fecha o modal
    const customReset = () => {
      reset();
      if (onSuccess) onSuccess();
    };

    // Passamos o customReset para a função do context
    studentRegister(data, customReset);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      {/* O título h2 foi removido para não duplicar com o header do modal */}
      
      <Input
        label="Nome do Aluno"
        type="text"
        placeholder="Digite o nome completo"
        error={errors.name}
        disabled={loading}
        {...register("name")}
      />

      <div className={styles.inputContainer}>
        <label className="label">Turma</label>
        <select 
          {...register("classroomId")} 
          className={styles.selectInput}
          disabled={loading}
        >
          <option value="">Selecione uma turma</option>
          {classrooms.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
        {errors.classroomId && (
          <p className={styles.error}>{errors.classroomId.message}</p>
        )}
      </div>

      <div className={styles.registerBox} style={{ marginTop: '20px' }}>
        <button type="submit" className="btn primary big" disabled={loading}>
          {loading ? (
            <img src={loadingImg} alt="Carregando..." />
          ) : (
            "CADASTRAR ALUNO"
          )}
        </button>
      </div>
    </form>
  );
};