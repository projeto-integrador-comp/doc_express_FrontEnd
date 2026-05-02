import styles from "./style.module.scss";
import { useContext, useState } from "react";
import Header from "../../components/Header/Header";
import { AttendanceContext } from "../../providers/AttendanceContext/index.jsx"; 
import { UserContext } from "../../providers/UserContext/index.jsx";
import { RegisterAttendanceModal } from "../../components/modals/RegisterAttendanceModal/index.jsx";
import { AttendanceList } from "../../components/AttendanceList";
import { UpdateAttendanceModal } from "../../components/modals/UpdateAttendanceModal/index.jsx";
import { AttendanceDetailsModal } from "../../components/modals/AttendanceDetailsModal/index.jsx";
import { UpdateUserModal } from "../../components/modals/UpdateUserModal/index.jsx";
import { AttendanceFilter } from "../../components/AttendanceFilter"; 

export const AttendancePage = () => {
  const {
    attendanceList,
    exportToCSV, 
    exportToXLSX,
    exportToPDF,
    hiddenCreateAttendance,
    editingAttendance,
    viewingAttendance,
  } = useContext(AttendanceContext);

  const { hiddenUpdateUser } = useContext(UserContext);
  
  // ESTADOS DOS FILTROS
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchName, setSearchName] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
    
  const classes = [...new Set(attendanceList.map(item => item.class))];
  
  const mappedForAutocomplete = attendanceList.map(item => ({
    id: item.id || Math.random(),
    name: item.studentName,
    turma: item.class,
    periodo: item.period,
    frequencyRate: item.frequencyRate
  }));

  // LÓGICA DE FILTRAGEM UNIFICADA DA TABELA
  const filteredAttendance = attendanceList.filter((item) => {
    const matchesStatus = 
      selectedFilter === "all" || 
      (selectedFilter === "risk" && item.frequencyRate < 75) ||
      (selectedFilter === "warning" && item.frequencyRate >= 75 && item.frequencyRate <= 85) ||
      (selectedFilter === "perfect" && item.frequencyRate === 100);

    const matchesName = item.studentName.toLowerCase().includes(searchName.toLowerCase());
    const matchesClass = selectedClass === "all" || item.class === selectedClass;
    const matchesPeriod = selectedPeriod === "all" || item.period === selectedPeriod;
    
    return matchesStatus && matchesName && matchesClass && matchesPeriod;
  });

  return (
    <div className={styles.container}>
      <Header />      
     
      {!hiddenCreateAttendance && <RegisterAttendanceModal />}
      {editingAttendance && <UpdateAttendanceModal />}
      {viewingAttendance && <AttendanceDetailsModal />}      
      {!hiddenUpdateUser && <UpdateUserModal />}

      <section className={styles.dashboardContent}>
        
        <header className={styles.pageHeader} style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
          <div className={styles.titleArea}>
            <h1>Relatórios</h1>
          </div>
        </header>        
        
        <div className={styles.topControlSection} style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>         
          
          
          <div style={{ flex: '1 1 auto' }}>
            <AttendanceFilter 
              searchName={searchName}
              setSearchName={setSearchName}
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              classes={classes}
              studentsForSuggestions={mappedForAutocomplete}
            />
          </div>
          
          <fieldset className={styles.exportFieldset} style={{ flex: '0 1 auto' }}>
            <legend>Exportar Dados</legend>
            <div className={styles.buttonGroup}>
              <button className={styles.btnExcel} onClick={() => exportToXLSX(filteredAttendance)}>Excel</button>
              <button className={styles.btnPdf} onClick={() => exportToPDF(filteredAttendance)}>PDF</button>
              <button className={styles.btnCsv} onClick={() => exportToCSV(filteredAttendance)}>CSV</button>
            </div>
          </fieldset>
        </div>

        {/* LISTAGEM PRINCIPAL */}
        <div className={styles.listContainer}>
          <header className={styles.listHeader}>
            <div className={styles.titleInfo}>
              <h3>Listagem de Assiduidade</h3>
              <p>Exibindo dados detalhados conforme os filtros aplicados.</p>
            </div>
            <span className={styles.counter}>{filteredAttendance.length} Alunos</span>
          </header>
          <AttendanceList documents={filteredAttendance} />
        </div>        
      </section>
    </div>
  );
};