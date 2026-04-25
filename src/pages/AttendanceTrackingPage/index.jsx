import styles from "./style.module.scss";
import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 1. Adicione o useLocation AQUI!
import Header from "../../components/Header/Header";
import { AttendanceContext } from "../../providers/AttendanceContext/index.jsx"; 
import { UserContext } from "../../providers/UserContext/index.jsx";

import { AttendanceList } from "../../components/AttendanceList";
import { RegisterAttendanceModal } from "../../components/modals/RegisterAttendanceModal/index.jsx";

// Constantes dos perfis
const PERFIS = {
  ADMINISTRADOR: 'admin',
  PROFESSOR: 'professor',
  USUARIO: 'usuário'
};

export const AttendanceTrackingPage = () => {
  const navigate = useNavigate(); 
  const location = useLocation(); // 2. Instancie o location
  
  const { setHiddenCreateAttendance, hiddenCreateAttendance } = useContext(AttendanceContext);
  const { user } = useContext(UserContext);
  const [searchName, setSearchName] = useState("");

  // 3. O SEGREDO ESTÁ AQUI 👇
  // Primeiro ele tenta ler se veio do "Voltar" (location.state.activeProfile). 
  // Se não veio de lá, usa o perfil real do usuário. Se não tiver usuário, usa ADMIN.
  const [simulatedRole, setSimulatedRole] = useState(
    location.state?.activeProfile || user?.role || PERFIS.ADMINISTRADOR
  );

  // 2. O DICIONÁRIO DE PERMISSÕES
  const MENU_CONFIG = {
    [PERFIS.ADMINISTRADOR]: [
      { id: 1, title: 'Cadastrar alunos', description: 'Cadastrar novos alunos', icon: '👨‍🎓', action: () => setHiddenCreateAttendance(false) },
      { id: 2, title: 'Cadastrar professor ou monitor', description: 'Cadastrar novos professores ou monitores', icon: '👩‍🏫', action: () => alert("Modal Professor") },
      { id: 3, title: 'Cadastrar turma', description: 'Cadastrar novas turmas', icon: '📚', action: () => alert("Modal Turma") }
    ],
    [PERFIS.PROFESSOR]: [
      { id: 1, title: 'Abrir ficha de chamada', description: 'Abrir ficha de chamada para registrar presença', icon: '📋', action: () => navigate('/attendanceregister'), highlight: true },      
      { id: 2, title: 'Relatórios', description: 'Exportar e visualizar triagem de assiduidade', icon: '📊', action: () => navigate('/attendance', { state: { originRole: simulatedRole } }) }
    ],
    [PERFIS.USUARIO]: [
      { id: 1, title: 'Consultar os dados', description: 'Avaliar frequência e histórico de faltas', icon: '🔍', action: () => document.getElementById("searchInput")?.focus() },      
      { id: 2, title: 'Relatórios', description: 'Exportar e visualizar relatórios do sistema', icon: '📊', action: () => navigate('/attendance', { state: { originRole: simulatedRole } }) }
    ]
  };

  // Puxa o menu correto baseado no estado simulado
  const menuAtual = MENU_CONFIG[simulatedRole] || MENU_CONFIG[PERFIS.USUARIO];

  return (
    <div className={styles.container}>
      <Header />
      {!hiddenCreateAttendance && <RegisterAttendanceModal />}

      <div className={styles.dashboardContent}>
        
        {/* O SELETOR DE PERFIS (Barra de Teste) */}
        <div className={styles.roleSelectorCard}>
          <p>Visualização do sistema como:</p>
          <div className={styles.roleButtons}>
            <button 
              className={simulatedRole === PERFIS.ADMINISTRADOR ? styles.activeRole : ""} 
              onClick={() => setSimulatedRole(PERFIS.ADMINISTRADOR)}
            >
              Administrador
            </button>
            <button 
              className={simulatedRole === PERFIS.PROFESSOR ? styles.activeRole : ""} 
              onClick={() => setSimulatedRole(PERFIS.PROFESSOR)}
            >
              Professor
            </button>
            <button 
              className={simulatedRole === PERFIS.USUARIO ? styles.activeRole : ""} 
              onClick={() => setSimulatedRole(PERFIS.USUARIO)}
            >
              Usuário
            </button>
          </div>
        </div>
        
        <div className={styles.cardsContainer}>
          <h3 className={styles.sectionTitle}>
            Ações Permitidas - <span className={styles.roleHighlight}>{simulatedRole}</span>
          </h3>

          <div className={styles.gridCards}>
            {menuAtual.map((item) => (
              <div key={item.id} className={`${styles.dashboardCard} ${item.highlight ? styles.cardHighlight : ''}`} onClick={item.action}>
                <div className={styles.cardIcon}>{item.icon}</div>
                <div className={styles.cardContent}>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};