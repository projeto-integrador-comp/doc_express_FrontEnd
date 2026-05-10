import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { RegisterTeacherModal } from "../../components/modals/RegisterTeacherModal";
import Header from "../../components/Header/Header"; 
import styles from "./style.module.scss";

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const token = localStorage.getItem("@tokenDocExpress");
      const response = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` }
      });      
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setUsers([]);
    }
  };

  useEffect(() => { loadData(); }, []);

  const deleteUser = async (id) => {
    if (confirm("Deseja realmente remover este registro?")) {
      try {
        const token = localStorage.getItem("@tokenDocExpress");
        await api.delete(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        loadData();
      } catch (error) {        
        console.error("Erro do Backend:", error.response?.data);
        alert(`Erro: ${error.response?.data?.message || "Sem permissão para excluir este usuário"}`);
      }
    }
  };

  const roleLabels = {
    ADMIN: "Administrador",
    TEACHER: "Professor",
    MONITOR: "Monitor"
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

          <h1>Gestão de Professores e Monitores</h1>

          <div className={styles.headerRight}>
            <button onClick={() => setShowCreateModal(true)} className={styles.addButton}>
              + Novo Registro
            </button>
          </div>
        </header>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Função</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user?.name || "N/A"}</td>
                  <td>{user?.email || "N/A"}</td>
                  <td>{roleLabels[user.role?.toUpperCase()] || "Não Definido"}</td>
                  <td className={styles.actionButtons}>
                    <div style={{ display: "flex", gap: "15px" }}>
                      <button className={styles.editBtn} onClick={() => setEditingUser(user)}>✏️ Editar</button>
                      <button className={styles.deleteBtn} onClick={() => deleteUser(user.id)}>🗑️ Excluir</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showCreateModal && (
          <RegisterTeacherModal onClose={() => { setShowCreateModal(false); loadData(); }} />
        )}

        {editingUser && (
          <RegisterTeacherModal
            user={editingUser}
            onClose={() => { setEditingUser(null); loadData(); }}
          />
        )}
      </div>
    </>
  );
};