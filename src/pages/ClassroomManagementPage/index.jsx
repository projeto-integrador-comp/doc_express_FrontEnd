import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { RegisterClassroomModal } from "../../components/modals/RegisterClassroomModal";
import Header from "../../components/Header/Header";
import styles from "./style.module.scss";
import { useNavigate } from "react-router-dom";

export const ClassroomManagementPage = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const token = localStorage.getItem("@tokenDocExpress");
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      const [classRes, userRes] = await Promise.all([
        api.get("/classrooms", headers),
        api.get("/users", headers)
      ]);

      setClassrooms(classRes.data);
      const onlyTeachers = userRes.data.filter(user =>
        user.role === "TEACHER"
      );

      setTeachers(onlyTeachers);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => { loadData(); }, []);

  const getTeacherName = (classroom) => {
    if (!teachers || teachers.length === 0) return "Carregando...";

    
    const tId = classroom.teacherId || classroom.teacher_id || classroom.teacher?.id;

    if (!tId) return "ID não encontrado";

    const teacher = teachers.find(t => String(t.id).trim() === String(tId).trim());

    return teacher ? teacher.name : "Não encontrado";
  };

  const deleteClassroom = async (id) => {
    if (confirm("Deseja realmente excluir esta turma?")) {
      try {
        const token = localStorage.getItem("@tokenDocExpress");
        await api.delete(`/classrooms/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        loadData();
      } catch (error) {
        alert("Erro ao deletar turma.");
      }
    }
  };

  return (
    <>      
        <Header />
      <div className={styles.container} style={{ marginTop: '30px' }}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
              ⬅️ Voltar
            </button>
          </div>

          <h1>Gestão de Turmas</h1>

          <div className={styles.headerRight}>
            <button
              onClick={() => {
                setEditingClassroom(null);
                setShowCreateModal(true);
              }}
              className={styles.addButton}
            >
              + Nova Turma
            </button>
          </div>
        </header>

        <div className={styles.mainCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome da Turma</th>
                <th>Professor Responsável</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {classrooms.map((cls) => (
                <tr key={cls.id}>
                  <td>{cls.name}</td>
                  <td>{cls.teacher?.name || "Sem professor"}</td>
                  <td>                    
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editBtn}
                        onClick={() => setEditingClassroom(cls)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => deleteClassroom(cls.id)}
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        {showCreateModal && (
          <RegisterClassroomModal
            teachers={teachers}
            onClose={() => {
              setShowCreateModal(false);
              loadData();
            }}
          />
        )}

        {editingClassroom && (
          <RegisterClassroomModal
            classroom={editingClassroom}
            teachers={teachers}
            onClose={() => {
              setEditingClassroom(null);
              loadData();
            }}
          />
        )}
      </div>
    </>
  );
};