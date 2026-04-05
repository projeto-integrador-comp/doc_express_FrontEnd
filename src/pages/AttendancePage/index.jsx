import styles from "./style.module.scss";
import { useContext, useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import { AttendanceContext } from "../../providers/AttendanceContext/index.jsx"; 
import { UserContext } from "../../providers/UserContext/index.jsx";

import { RegisterAttendanceModal } from "../../components/modals/RegisterAttendanceModal/index.jsx";
import { AttendanceList } from "../../components/AttendanceList";
import { UpdateAttendanceModal } from "../../components/modals/UpdateAttendanceModal/index.jsx";
import { AttendanceDetailsModal } from "../../components/modals/AttendanceDetailsModal/index.jsx";
import { UpdateUserModal } from "../../components/modals/UpdateUserModal/index.jsx";

export const AttendancePage = () => {
  const {
    attendanceList,
    exportToCSV, 
    exportToXLSX,
    exportToPDF,
    setHiddenCreateAttendance,
    hiddenCreateAttendance,
    editingAttendance,
    viewingAttendance,
    setViewingAttendance,
  } = useContext(AttendanceContext);

  const { hiddenUpdateUser } = useContext(UserContext);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock para visualização inicial
  const mockAttendance = {
    studentName: "Aluno Exemplo",
    class: "8º Ano B",
    frequencyRate: 72,
    absences: 12,
    status: "Risco",
    lastUpdate: new Date().toISOString()
  };

  useEffect(() => {
    setViewingAttendance(mockAttendance);
    return () => setViewingAttendance(null);
  }, []);

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const filteredAttendance = attendanceList.filter((item) => {
    if (selectedFilter === "risk") return item.frequencyRate < 75;
    if (selectedFilter === "warning") return item.frequencyRate >= 75 && item.frequencyRate <= 85;
    if (selectedFilter === "perfect") return item.frequencyRate === 100;
    return true;
  });

  return (
    <div className={styles.container}>
      <Header />
      
      {/* Modais */}
      {!hiddenCreateAttendance && <RegisterAttendanceModal />}
      {editingAttendance && <UpdateAttendanceModal />}
      {viewingAttendance && <AttendanceDetailsModal />}      
      {!hiddenUpdateUser && <UpdateUserModal />}

      <section className={styles.dashboardContent}>
        
        {/* Painel de Controle Superior */}
        <div className={styles.topControlSection}>
          
          <fieldset className={styles.filterFieldset}>
            <legend>Filtros de Assiduidade</legend>
            <div className={styles.filterOptions}>
              <label>
                <input type="radio" name="attendanceFilter" value="all" checked={selectedFilter === "all"} onChange={handleFilterChange} />
                Todos
              </label>
              <label>
                <input type="radio" name="attendanceFilter" value="risk" checked={selectedFilter === "risk"} onChange={handleFilterChange} />
                Risco Crítico ({"<"}75%)
              </label>
              <label>
                <input type="radio" name="attendanceFilter" value="warning" checked={selectedFilter === "warning"} onChange={handleFilterChange} />
                Atenção (75%-85%)
              </label>
              <label>
                <input type="radio" name="attendanceFilter" value="perfect" checked={selectedFilter === "perfect"} onChange={handleFilterChange} />
                Frequência 100%
              </label>
            </div>
          </fieldset>

          <fieldset className={styles.exportFieldset}>
            <legend>Exportar Relatório</legend>
            <div className={styles.buttonGroup}>
              <button className={styles.btnExcel} onClick={() => exportToXLSX(filteredAttendance)} title="Exportar Excel">Excel</button>
              <button className={styles.btnPdf} onClick={() => exportToPDF(filteredAttendance)} title="Exportar PDF">PDF</button>
              <button className={styles.btnCsv} onClick={() => exportToCSV(filteredAttendance)} title="Exportar CSV">CSV</button>
            </div>
          </fieldset>
          
        </div>

        {/* Listagem de Alunos */}
        <div className={styles.listContainer}>
          <header className={styles.listHeader}>
            <div className={styles.titleInfo}>
              <h3>Resultados da Triagem</h3>
              <p>Visualizando dados brutos para fins de gestão</p>
            </div>
            <span className={styles.counter}>{filteredAttendance.length} registro(s) encontrado(s)</span>
          </header>
          <AttendanceList documents={filteredAttendance} />
        </div>         
      </section>
    </div>
  );
};