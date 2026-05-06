import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { RegisterStudentModal } from "../../components/modals/RegisterStudentModal";
import styles from "./style.module.scss";

export const StudentManagementPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("@tokenDocExpress");
        const headers = { Authorization: `Bearer ${token}` };

        // Buscamos estudantes e turmas
        const [studentRes, classroomRes] = await Promise.all([
          api.get("/students", { headers }),
          api.get("/classrooms", { headers })
        ]);

        // Verifique se os dados estão chegando no console
        console.log("Estudantes:", studentRes.data);
        console.log("Turmas:", classroomRes.data);

        setStudents(studentRes.data);
        setClassrooms(classroomRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadData();
  }, []);

  const deleteStudent = async (id) => {
    // 1. Confirmação para evitar exclusões acidentais
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        const token = localStorage.getItem("@tokenDocExpress");

        // 2. Chamada para a API
        await api.delete(`/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 3. Atualização da lista local para remover o aluno da tela
        setStudents((prevStudents) => prevStudents.filter((s) => s.id !== id));

        alert("Aluno excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar aluno:", error);
        alert("Não foi possível excluir o aluno. Verifique se você tem permissão.");
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ⬅ Voltar
          </button>
          <h1>Gestão de Estudantes</h1>
          <button
            className={styles.addBtn}
            onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}
          >
            + Novo Estudante
          </button>
        </header>

        <main className={styles.mainCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>NOME</th>
                <th>TURMA</th>
                <th style={{ textAlign: "center" }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>
                      {classrooms.find(c => c.id === student.classroom?.id)?.name || "N/A"}
                    </td>
                    <td className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => {
                          setEditingStudent(student); 
                          setIsModalOpen(true);
                        }}>✏️ Editar
                        </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => deleteStudent(student.id)}
                      >
                        🗑️ Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "2rem" }}>
                    Nenhum estudante encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </main>
      </div>

      {isModalOpen && (
        <RegisterStudentModal
          onClose={() => setIsModalOpen(false)}
          student={editingStudent}
          setStudents={setStudents}
        />
      )}
    </div>
  );
};