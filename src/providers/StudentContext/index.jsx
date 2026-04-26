import { createContext, useState } from "react";
import { api } from "../../services/api";
import { toast } from "react-toastify";

export const StudentContext = createContext({});

export const StudentProvider = ({ children }) => {
  const [studentsList, setStudentsList] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  // Padronizado para 'updating' conforme sua AdminManagementPage
  const [updatingStudent, setUpdatingStudent] = useState(null);

  // 1. Buscar todas as turmas
  const getClassrooms = async () => {
    const token = localStorage.getItem("@tokenDocExpress");
    try {
      const { data } = await api.get("/classrooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassrooms(data);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
    }
  };

  // 2. Cadastrar novo aluno
  const studentRegister = async (formData, reset) => {
    const token = localStorage.getItem("@tokenDocExpress");
    try {
      setLoading(true);
      await api.post("/students", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Aluno cadastrado com sucesso!");
      reset(); 
      await getAllStudents(); // Atualiza a lista após cadastrar
    } catch (error) {
      toast.error("Erro ao cadastrar aluno. Verifique os dados.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Atualizar aluno (Update)
  const studentUpdate = async (formData, id) => {
    const token = localStorage.getItem("@tokenDocExpress");
    try {
      setLoading(true);
      const { data } = await api.patch(`/students/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success("Dados do aluno atualizados!");
      
      // Atualiza a lista local com os novos dados
      setStudentsList((prev) => 
        prev.map((student) => (student.id === id ? { ...student, ...data } : student))
      );
      
      setUpdatingStudent(null); // Fecha o modal
    } catch (error) {
      toast.error("Erro ao atualizar aluno.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 4. Listar alunos
  const getAllStudents = async () => {
    const token = localStorage.getItem("@tokenDocExpress");
    try {
      const { data } = await api.get("/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentsList(data);
    } catch (error) {
      console.error(error);
    }
  };

  // 5. Deletar aluno
  const studentDelete = async (id) => {
    const token = localStorage.getItem("@tokenDocExpress");
    try {
      setLoading(true);
      await api.delete(`/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.error("Aluno removido com sucesso");
      setStudentsList((prevStudents) => prevStudents.filter(student => student.id !== id));
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Você não tem permissão para excluir alunos.");
      } else {
        toast.error("Erro ao excluir aluno.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentContext.Provider
      value={{
        studentsList,
        classrooms,
        loading,
        updatingStudent,      // ADICIONADO
        setUpdatingStudent,   // ADICIONADO
        studentUpdate,        // ADICIONADO
        studentDelete,
        getClassrooms,
        studentRegister,
        getAllStudents,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};