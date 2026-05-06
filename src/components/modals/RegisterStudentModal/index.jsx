import styles from "./style.module.scss";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { api } from "../../../services/api";

export const RegisterStudentModal = ({ onClose, student, setStudents }) => {
  // 1. Hooks sempre no topo
  const { register, handleSubmit, setValue } = useForm();
  const [classrooms, setClassrooms] = useState([]);

  // 2. useEffect para carregar as turmas (Executa uma vez ao abrir)
  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        const token = localStorage.getItem("@tokenDocExpress");
        const response = await api.get("/classrooms", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClassrooms(response.data);
      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
      }
    };
    loadClassrooms();
  }, []);

  // 3. useEffect para preencher os campos se for EDIÇÃO
  // Note: Não há Hooks dentro de funções aqui!
  // No RegisterStudentModal.jsx

  useEffect(() => {
    // Só preenchemos os dados se o estudante existir E a lista de turmas já tiver itens
    if (student && classrooms.length > 0) {
      setValue("name", student.name);

      if (student.classroom?.id) {
        const idTurma = String(student.classroom.id);
        setValue("classroomId", idTurma);
        console.log("Agora o select tem opções e o ID foi setado:", idTurma);
      }
    }
  }, [student, classrooms, setValue]); // Adicionamos 'classrooms' aqui

  const submit = async (data) => {
    try {
      const token = localStorage.getItem("@tokenDocExpress");
      const headers = { Authorization: `Bearer ${token}` };

      if (student) {
        // MODO EDIÇÃO
        const response = await api.patch(`/students/${student.id}`, data, { headers });
        setStudents((prev) => prev.map((s) => (s.id === student.id ? response.data : s)));
        alert("Atualizado com sucesso!");
      } else {
        // MODO CADASTRO
        const response = await api.post("/students", data, { headers });
        setStudents((prev) => [...prev, response.data]);
        alert("Matriculado com sucesso!");
      }
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro na operação.");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <h2>{student ? "Editar Aluno" : "Novo Aluno"}</h2>
          <button onClick={onClose}>X</button>
        </header>

        <form onSubmit={handleSubmit(submit)}>
          <div className={styles.inputGroup}>
            <label>Nome</label>
            <input {...register("name", { required: true })} />
          </div>

          <div className={styles.inputGroup}>
            <label>Turma</label>
            <select {...register("classroomId", { required: true })}>
              <option value="">Selecione a turma</option>
              {classrooms.map((c) => (
                // O value aqui deve ser exatamente o 'id'
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            {student ? "Salvar" : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
};