import styles from "./style.module.scss";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import { AttendanceFilter } from "../../components/AttendanceFilter";

export const AttendanceOverviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const originRole = location.state?.originRole;
  const roleLabels = { admin: 'ADMIN', professor: 'TEACHER', usuário: 'MONITOR' };  
  
  const [searchName, setSearchName] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [calendarDate, setCalendarDate] = useState(new Date(2026, 4, 1));   

  const mockStudents = [
    {
      id: 1, name: "Elisa Oliveira", turma: "Berçário II", periodo: "Matutino",
      history: [
        { id: 1, date: "15/05/2026", status: "P", note: "" },
        { id: 2, date: "14/05/2026", status: "F", note: "Atestado médico" },
        { id: 3, date: "13/05/2026", status: "P", note: "" },
        { id: 4, date: "12/05/2026", status: "P", note: "" },
      ]
    },
    {
      id: 2, name: "Gustavo Silva", turma: "Maternal II", periodo: "Matutino",
      history: [
        { id: 1, date: "15/05/2026", status: "F", note: "Sem justificativa" },
        { id: 2, date: "14/05/2026", status: "F", note: "Sem justificativa" },
        { id: 3, date: "13/05/2026", status: "P", note: "" },
      ]
    },
    {
      id: 3, name: "Ana Clara", turma: "Maternal I", periodo: "Vespertino",
      history: [
        { id: 1, date: "15/05/2026", status: "P", note: "" },
        { id: 2, date: "14/05/2026", status: "P", note: "" },
        { id: 3, date: "13/05/2026", status: "P", note: "" },
      ]
    }
  ];
  
  const studentsWithFrequency = mockStudents.map(student => {
    const total = student.history.length;
    const present = student.history.filter(h => h.status === "P").length;
    const freq = total > 0 ? Math.round((present / total) * 100) : 0;
    return { ...student, frequencyRate: freq, totalClasses: total, totalPresent: present, totalAbsent: total - present };
  });

  const filteredStudents = studentsWithFrequency.filter(item => {
    const matchesStatus = 
      selectedFilter === "all" || 
      (selectedFilter === "risk" && item.frequencyRate < 75) ||
      (selectedFilter === "warning" && item.frequencyRate >= 75 && item.frequencyRate <= 85) ||
      (selectedFilter === "perfect" && item.frequencyRate === 100);

    const matchesName = item.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesClass = selectedClass === "all" || item.turma === selectedClass;
    const matchesPeriod = selectedPeriod === "all" || item.periodo === selectedPeriod;

    return matchesStatus && matchesName && matchesClass && matchesPeriod;
  });
  
  const studentData = searchName.trim() !== "" 
    ? filteredStudents.find(s => s.name.toLowerCase() === searchName.toLowerCase())
    : null;

  const classesList = [...new Set(mockStudents.map(item => item.turma))];

  // LÓGICA DO CALENDÁRIO
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const handlePrevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); 

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.mainContent}>
        
        <header className={styles.pageHeader}>
          <div className={styles.titleArea}>
            <h1>Consultar Frequência</h1>
          </div>          
        </header>

        <AttendanceFilter 
          searchName={searchName}
          setSearchName={setSearchName}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          classes={classesList}
          studentsForSuggestions={studentsWithFrequency} 
        />
        
        <section className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <h3 style={{ color: '#475569' }}>Frequência Geral</h3>
            <div 
              className={`${styles.highlightValue} ${studentData ? (studentData.frequencyRate >= 75 ? styles.good : styles.bad) : ''}`} 
              style={{ color: !studentData ? '#cbd5e1' : undefined }}
            >
              {studentData ? `${studentData.frequencyRate}%` : '-'}
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#1e293b', fontWeight: 'bold', marginTop: '10px' }}>
              {studentData ? `${studentData.name} (${studentData.turma})` : 'Nenhum aluno selecionado'}
            </p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Presenças</h3>
            <div className={styles.valuePresent} style={{ color: !studentData ? '#cbd5e1' : undefined }}>
              {studentData ? studentData.totalPresent : '-'}
            </div>
          </div>
          <div className={styles.summaryCard}>
            <h3>Faltas</h3>
            <div className={styles.valueAbsent} style={{ color: !studentData ? '#cbd5e1' : undefined }}>
              {studentData ? studentData.totalAbsent : '-'}
            </div>
          </div>
        </section>
        
        <section className={styles.calendarSection}>
          <div className={styles.sectionHeader}>
            <h2>Calendário Visual</h2>
            
            <div className={styles.monthSelector}>
              <button onClick={handlePrevMonth} className={styles.arrowBtn}>&lt;</button>
              <span className={styles.monthDisplay}>{monthNames[month]} {year}</span>
              <button onClick={handleNextMonth} className={styles.arrowBtn}>&gt;</button>
            </div>
          </div>
          
          <div className={styles.calendarGrid}>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
              <div key={d} className={styles.weekDay}>{d}</div>
            ))}
            
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className={styles.emptyDay}></div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayStr = String(i + 1).padStart(2, '0');
              const monthStr = String(month + 1).padStart(2, '0');
              const dateStr = `${dayStr}/${monthStr}/${year}`;                           
              const record = studentData ? studentData.history.find(h => h.date === dateStr) : null;
              
              let dayClass = styles.calendarDay;
              if (record) {
                dayClass += record.status === 'P' ? ` ${styles.dayPresent}` : ` ${styles.dayAbsent}`;
              }

              return <div key={i} className={dayClass}>{i + 1}</div>;
            })}
          </div>
        </section>
        
        {!studentData && (
          <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', marginTop: '20px' }}>
            <h3 style={{ color: '#475569', marginBottom: '10px' }}>Aguardando seleção 🔍</h3>
            <p style={{ color: '#64748b' }}>Utilize a barra de pesquisa acima para buscar e selecionar um aluno. Os dados de frequência aparecerão logo em seguida.</p>
          </div>
        )}

      </main>
    </div>
  );
};