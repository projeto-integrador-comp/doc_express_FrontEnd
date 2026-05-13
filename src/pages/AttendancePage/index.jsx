import styles from "./style.module.scss";
import { useContext, useState, useEffect } from "react";
import { api } from "../../services/api";
import { toast } from "react-toastify";
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
    exportToCSV, 
    exportToXLSX,
    exportToPDF,
    hiddenCreateAttendance,
    editingAttendance,
    viewingAttendance,
  } = useContext(AttendanceContext);

  const { hiddenUpdateUser } = useContext(UserContext);
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchName, setSearchName] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("@tokenDocExpress");

      const responseStudents = await api.get("/students", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const alunos = responseStudents.data;

      const presencesPromises = alunos.map(async (aluno) => {
        try {
          const res = await api.get(`/attendance/student/${aluno.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const records = Array.isArray(res.data) ? res.data : (res.data?.data || [res.data]);
          return { alunoId: aluno.id, records };
        } catch (err) { 
          return { alunoId: aluno.id, records: [] }; 
        }
      });

      const todasPresencasRaw = await Promise.all(presencesPromises);

      const formattedReport = alunos.map(s => {
        const studentRecordsObj = todasPresencasRaw.find(r => r.alunoId === s.id);
        const records = studentRecordsObj ? studentRecordsObj.records : [];

        const presencesCount = records.filter(r => r.status === 'P').length;
        const absencesCount = records.filter(r => r.status === 'F').length;
        const totalValidRecords = presencesCount + absencesCount;
        
        let frequencyRate = null;
        let riskLevelText = "Sem Registros";
        
        if (totalValidRecords > 0) {
          frequencyRate = Math.round((presencesCount / totalValidRecords) * 100);
          
          if (frequencyRate === 100) riskLevelText = "Excelente";
          else if (frequencyRate >= 75 && frequencyRate <= 85) riskLevelText = "Atenção";
          else if (frequencyRate < 75) riskLevelText = "Em Risco";
          else riskLevelText = "Regular";
        }

        return {
          id: s.id,
          studentName: s.name,
          class: s.classroom?.name || "Sem Turma",
          period: "Matutino",
          frequencyRate: frequencyRate,
          presences: presencesCount, 
          absences: absencesCount,   
          status: riskLevelText,     
          rawRecords: records 
        };
      });

      setAttendanceData(formattedReport);
    } catch (error) {
      toast.error("Erro ao buscar dados do relatório no servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);
    
  const classes = [...new Set(attendanceData.map(item => item.class))];
  
  const mappedForAutocomplete = attendanceData.map(item => ({
    id: item.id || Math.random(),
    name: item.studentName,
    turma: item.class,
    periodo: item.period,
    frequencyRate: item.frequencyRate
  }));
  
  const filteredAttendance = attendanceData.filter((item) => {
    const matchesStatus = 
      selectedFilter === "all" || 
      (selectedFilter === "risk" && item.frequencyRate !== null && item.frequencyRate < 75) ||
      (selectedFilter === "warning" && item.frequencyRate !== null && item.frequencyRate >= 75 && item.frequencyRate <= 85) ||
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
              <button className={styles.btnExcel} onClick={() => exportToXLSX(filteredAttendance)} disabled={loading}>Excel</button>
              <button className={styles.btnPdf} onClick={() => exportToPDF(filteredAttendance)} disabled={loading}>PDF</button>
              <button className={styles.btnCsv} onClick={() => exportToCSV(filteredAttendance)} disabled={loading}>CSV</button>
            </div>
          </fieldset>
        </div>

        <div className={styles.listContainer}>
          <header className={styles.listHeader}>
            <div className={styles.titleInfo}>
              <h3>Listagem de Assiduidade</h3>
              <p>Exibindo dados detalhados conforme os filtros aplicados.</p>
            </div>
            <span className={styles.counter}>{filteredAttendance.length} Alunos</span>
          </header>
          
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
              <h3>Carregando relatórios do servidor...</h3>
            </div>
          ) : (
            <AttendanceList documents={filteredAttendance} />
          )}
        </div>        
      </section>
    </div>
  );
};