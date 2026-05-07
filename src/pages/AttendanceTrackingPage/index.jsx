import styles from "./style.module.scss";
import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import { AttendanceContext } from "../../providers/AttendanceContext/index.jsx"; 
import { UserContext } from "../../providers/UserContext/index.jsx";

// Mantemos apenas o modal de registro de presença, se ele ainda for necessário aqui
import { RegisterAttendanceModal } from "../../components/modals/RegisterAttendanceModal/index.jsx";

const PERFIS = {
  ADMINISTRADOR: 'ADMIN',
  PROFESSOR: 'TEACHER',
  USUARIO: 'MONITOR'
};

export const AttendanceTrackingPage = () => {
  const navigate = useNavigate(); 
  const location = useLocation();
  
  const { hiddenCreateAttendance } = useContext(AttendanceContext);
  const { user } = useContext(UserContext);
  
  const [simulatedRole] = useState(
    location.state?.activeProfile || user?.role || PERFIS.ADMINISTRADOR
  );

  const MENU_CONFIG = {
    [PERFIS.ADMINISTRADOR]: [
      { 
        id: 1, 
        title: 'Gestão de Alunos', 
        description: 'Listar, cadastrar ou editar alunos', 
        icon: '👨‍🎓', 
        action: () => navigate('/student-management') 
      },
      { 
        id: 2, 
        title: 'Gestão de Professores', 
        description: 'Gerenciar professores e monitores', 
        icon: '👩‍🏫', 
        action: () => navigate('/teacher-management') 
      },
      { 
        id: 3, 
        title: 'Gestão de Turmas', 
        description: 'Listar, editar ou remover turmas', 
        icon: '📚', 
        action: () => navigate('/classroom-management') 
      }
    ],
    [PERFIS.PROFESSOR]: [
      { 
        id: 1, 
        title: 'Abrir ficha de chamada', 
        description: 'Registrar presença dos alunos', 
        icon: '📋', 
        action: () => navigate('/attendanceregister'), 
        highlight: true 
      },      
      { 
        id: 2, 
        title: 'Relatórios', 
        description: 'Visualizar assiduidade e exportar dados', 
        icon: '📊', 
        action: () => navigate('/attendance', { state: { originRole: simulatedRole } }) 
      }
    ],
    [PERFIS.USUARIO]: [
      { 
        id: 1, 
        title: 'Consultar os dados', 
        description: 'Avaliar frequência e histórico de faltas', 
        icon: '🔍', 
        action: () => navigate('/attendanceoverview', { state: { originRole: simulatedRole } }) 
      }
    ]
  };
  
  const menuAtual = MENU_CONFIG[simulatedRole] || MENU_CONFIG[PERFIS.USUARIO];

  return (
    <div className={styles.container}>
      <Header />
      
      {/* O Modal de presença permanece se o contexto exigir */}
      {!hiddenCreateAttendance && <RegisterAttendanceModal />}
      
      <div className={styles.dashboardContent}>
        <div className={styles.cardsContainer}>
          <h3 className={styles.sectionTitle}>
            Painel de Controle - <span className={styles.roleHighlight}>{simulatedRole}</span>
          </h3>

          <div className={styles.gridCards}>
            {menuAtual.map((item) => (
              <div 
                key={item.id} 
                className={`${styles.dashboardCard} ${item.highlight ? styles.cardHighlight : ''}`} 
                onClick={item.action}
              >
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