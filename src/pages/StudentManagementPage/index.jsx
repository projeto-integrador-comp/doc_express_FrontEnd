import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { RegisterStudentModal } from "../../components/modals/RegisterStudentModal";
import Header from "../../components/Header/Header";
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
        
        const [studentRes, classroomRes] = await Promise.all([
          api.get("/students", { headers }),
          api.get("/classrooms", { headers })
        ]);

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

    if (confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        const token = localStorage.getItem("@tokenDocExpress");

        await api.delete(`/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setStudents((prevStudents) => prevStudents.filter((s) => s.id !== id));

        alert("Aluno excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar aluno:", error);
        alert("Não foi possível excluir o aluno. Verifique se você tem permissão.");
      }
    }
  };

  return (
    <>       
      <Header />
      <div className={styles.pageContainer} style={{ marginTop: '30px' }}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <button onClick={() => navigate(-1)} className={styles.backButton}>
                ⬅️ Voltar
              </button>
            </div>

            <h1 className={styles.titleCenter}>Gestão de Estudantes</h1>

            <div className={styles.headerRight}>              
              <button
                onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}
                className={styles.addButton}
              >
                + Novo Estudante
              </button>
            </div>
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
                          }}>
                          ✏️ Editar
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
    </>
  );
};