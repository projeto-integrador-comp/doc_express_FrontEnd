import styles from "./style.module.scss";
import { useContext, useState } from "react";
import Header from "../../components/Header/Header";
import { AttendanceContext } from "../../providers/AttendanceContext/index.jsx"; 
import { UserContext } from "../../providers/UserContext/index.jsx";

import { AttendanceList } from "../../components/AttendanceList";
import { RegisterAttendanceModal } from "../../components/modals/RegisterAttendanceModal/index.jsx";

// Constantes dos perfis
const PERFIS = {
  ADMINISTRADOR: 'admin',
  PROFESSOR: 'professor',
  USUARIO: 'aluno' // ou comum
};

export const AttendanceTrackingPage = () => {
  const { setHiddenCreateAttendance, hiddenCreateAttendance } = useContext(AttendanceContext);
  const { user } = useContext(UserContext);
  const [searchName, setSearchName] = useState("");

  // 1. ESTADO DE SIMULAÇÃO DE PERFIL
  // Inicia com o perfil real do usuário, mas permite mudar clicando nos botões
  const [simulatedRole, setSimulatedRole] = useState(user?.role || PERFIS.ADMINISTRADOR);

  // 2. O DICIONÁRIO DE PERMISSÕES
  const MENU_CONFIG = {
    [PERFIS.ADMINISTRADOR]: [
      { id: 1, title: 'Cadastrar alunos', description: 'Permitir associar presença/falta', icon: '👨‍🎓', action: () => setHiddenCreateAttendance(false) },
      { id: 2, title: 'Cadastrar professor', description: 'Permitir criar registros de chamadas', icon: '👩‍🏫', action: () => alert("Modal Professor") },
      { id: 3, title: 'Cadastrar turma', description: 'Associar alunos a turma', icon: '📚', action: () => alert("Modal Turma") }
    ],
    [PERFIS.PROFESSOR]: [
      { id: 1, title: 'Abrir ficha de chamada', description: 'Apontamento da turma de alunos', icon: '📋', action: () => window.location.href='/attendance', highlight: true }
    ],
    [PERFIS.USUARIO]: [
      { id: 1, title: 'Consultar os dados', description: 'Avaliar frequência e histórico', icon: '🔍', action: () => document.getElementById("searchInput").focus() }
    ]
  };

  // Puxa o menu correto baseado no estado simulado
  const menuAtual = MENU_CONFIG[simulatedRole] || MENU_CONFIG[PERFIS.USUARIO];

  return (
    <div className={styles.container}>
      <Header />
      {!hiddenCreateAttendance && <RegisterAttendanceModal />}

      <div className={styles.dashboardContent}>
        
        {/* 3. O SELETOR DE PERFIS (Barra de Teste) */}
        <div className={styles.roleSelectorCard}>
          <p>Simular visualização do sistema como:</p>
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
              Aluno/Usuário
            </button>
          </div>
        </div>

        {/* Renderização do Menu Atual */}
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

        {/* Restante da página... */}
        <div className={styles.listArea}>
          <div className={styles.searchHeader}>
            <h3>Consulta de Assiduidade</h3>
            <div className={styles.searchInput}>
              <input id="searchInput" type="text" placeholder="Pesquisar registro..." value={searchName} onChange={(e) => setSearchName(e.target.value)} />
            </div>
          </div>
          <AttendanceList />
        </div>

      </div>
    </div>
  );
};