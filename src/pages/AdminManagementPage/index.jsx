import { useState, useContext, useEffect } from "react"; 
import Header from "../../components/Header/Header";
import { ManagementList } from "../../components/ManagementList";
import { UserContext } from "../../providers/UserContext";
import { StudentContext } from "../../providers/StudentContext";

import { RegisterUserModal } from "../../components/modals/RegisterUserModal";
import { RegisterStudentModal } from "../../components/modals/RegisterStudentModal";
import { UpdateStudentModal } from "../../components/modals/UpdateStudentModal";
import { UpdateUserModal } from "../../components/modals/UpdateUserModal";

import styles from "./style.module.scss";

export const AdminManagementPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [isRegisterUserOpen, setIsRegisterUserOpen] = useState(false);
  const [isRegisterStudentOpen, setIsRegisterStudentOpen] = useState(false);

  // Pegamos tudo do UserContext e StudentContext
  const { allUsersList, getAllUsers, userDelete, setUpdatingUser } = useContext(UserContext);
  const { studentsList, getAllStudents, getClassrooms, studentDelete, setUpdatingStudent } = useContext(StudentContext);
    
  useEffect(() => {
    // Carrega os dados assim que entra na página
    getAllUsers();
    getAllStudents();
    getClassrooms();
  }, []);

  return (
    <>
      <Header />
      <main className="container">
        <section className={styles.managementSection}>
          <h1 className="title textCenter">Painel de Gestão Administrativa</h1>
          
          <div className={styles.tabContainer}>
            <button 
              className={activeTab === "users" ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab("users")}
            >
              Colaboradores
            </button>
            <button 
              className={activeTab === "students" ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab("students")}
            >
              Alunos
            </button>
          </div>

          <div className={styles.contentWrapper}>
            {activeTab === "users" ? (
              <div className={styles.fade}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                   <button className="btn primary big" onClick={() => setIsRegisterUserOpen(true)}>
                     + CADASTRAR COLABORADOR
                   </button>
                </div>
                <ManagementList 
                  title="Colaboradores Cadastrados"
                  items={allUsersList}
                  type="user"
                  onDelete={(id) => userDelete(id)} 
                  onEdit={(user) => setUpdatingUser(user)}
                />
              </div>
            ) : (
              <div className={styles.fade}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                   <button className="btn primary big" onClick={() => setIsRegisterStudentOpen(true)}>
                     + CADASTRAR ALUNO
                   </button>
                </div>
                <ManagementList 
                  title="Alunos Cadastrados"
                  items={studentsList}
                  type="student"
                  onDelete={(id) => studentDelete(id)}
                  onEdit={(student) => setUpdatingStudent(student)}
                />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Renderização dos Modais */}
      <RegisterUserModal isOpen={isRegisterUserOpen} setIsOpen={setIsRegisterUserOpen} />
      <RegisterStudentModal isOpen={isRegisterStudentOpen} setIsOpen={setIsRegisterStudentOpen} />
      <UpdateStudentModal />
      <UpdateUserModal />
    </>
  );
};