import styles from "./style.module.scss";
import { useContext, useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import { AttendanceContext } from "../../providers/AttendanceContext/index.jsx"; // Supondo que você criará este provider
import { UserContext } from "../../providers/UserContext/index.jsx";

// Componentes hipotéticos baseados na sua estrutura
import { RegisterAttendanceModal } from "../../components/modals/RegisterAttendanceModal/index.jsx";
import { AttendanceList } from "../../components/AttendanceList";
import { UpdateAttendanceModal } from "../../components/modals/UpdateAttendanceModal/index.jsx";
import { AttendanceDetailsModal } from "../../components/modals/AttendanceDetailsModal/index.jsx";

export const AttendancePage = () => {
  const {
    attendanceList, // Lista de alunos com dados de frequência
    setHiddenCreateAttendance,
    hiddenCreateAttendance,
    editingAttendance,
    viewingAttendance,
    setViewingAttendance,
  } = useContext(AttendanceContext);

  const { deletingUser, hiddenUpdateUser } = useContext(UserContext);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock para teste de visualização (similar ao seu mockDocument)
  const mockAttendance = {
    studentName: "Aluno Exemplo",
    class: "8º Ano B",
    frequencyRate: 72, // Porcentagem
    absences: 12,
    status: "Risco",
    lastUpdate: new Date().toISOString()
  };

  useEffect(() => {
    // Abre o detalhe do aluno ao carregar (para teste de layout)
    setViewingAttendance(mockAttendance);
    
    return () => setViewingAttendance(null);
  }, []);

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  // Lógica de filtragem baseada em Assiduidade
  const filteredAttendance = attendanceList.filter((item) => {
    if (selectedFilter === "risk") {
      return item.frequencyRate < 75; // Abaixo do limite da LDB
    }
    if (selectedFilter === "warning") {
      return item.frequencyRate >= 75 && item.frequencyRate <= 85;
    }
    if (selectedFilter === "perfect") {
      return item.frequencyRate === 100;
    }
    return true; // "all"
  });

  return (
    <div className={styles.container}>
      <Header />
      
      {/* Modais de Gerenciamento */}
      {!hiddenCreateAttendance && <RegisterAttendanceModal />}
      {editingAttendance && <UpdateAttendanceModal />}
      {viewingAttendance && <AttendanceDetailsModal />}
      
      {/* Modais de Usuário (Herdados da DashboardPage) */}
      {!hiddenUpdateUser && <UpdateUserModal />}

      <section className={styles.dashboardContent}>
        <fieldset className={styles.filterFieldset}>
          <legend>Filtros de Assiduidade</legend>
          <div className={styles.filterOptions}>
            <label>
              <input
                type="radio"
                name="attendanceFilter"
                value="all"
                checked={selectedFilter === "all"}
                onChange={handleFilterChange}
              />
              Todos os Alunos
            </label>
            <label>
              <input
                type="radio"
                name="attendanceFilter"
                value="risk"
                checked={selectedFilter === "risk"}
                onChange={handleFilterChange}
              />
              Risco Crítico ({"<"} 75%)
            </label>
            <label>
              <input
                type="radio"
                name="attendanceFilter"
                value="warning"
                checked={selectedFilter === "warning"}
                onChange={handleFilterChange}
              />
              Atenção (75% - 85%)
            </label>
            <label>
              <input
                type="radio"
                name="attendanceFilter"
                value="perfect"
                checked={selectedFilter === "perfect"}
                onChange={handleFilterChange}
              />
              Frequência 100%
            </label>
          </div>
        </fieldset>

        <div className={styles.listContainer}>
          <fieldset>
            <legend>
              <button
                className={styles.addButton}
                onClick={() => setHiddenCreateAttendance(false)}
              >
                Registrar Nova Presença
              </button>
            </legend>
            
            {/* Componente que renderiza a tabela ou cards */}
            <AttendanceList data={filteredAttendance} />
          </fieldset>
        </div>
      </section>
    </div>
  );
};