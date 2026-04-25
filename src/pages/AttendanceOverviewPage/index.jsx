import styles from "./style.module.scss";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";

export const AttendanceOverviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const originRole = location.state?.originRole;

  const roleLabels = { admin: 'Administrador', professor: 'Professor', usuário: 'Usuário' };

  const handleGoBack = () => {
    if (originRole) {
      navigate('/attendancetracking', { state: { activeProfile: originRole } });
    } else {
      navigate(-1);
    }
  };
  
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 4, 1));   
  
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Dados mockados
  const studentData = {
    name: "Elisa Oliveira", turma: "Berçário II", periodo: "Matutino",
    history: [
      { id: 1, date: "15/05/2026", status: "P", note: "" },
      { id: 2, date: "14/05/2026", status: "F", note: "Atestado médico" },
      { id: 3, date: "13/05/2026", status: "P", note: "" },
      { id: 4, date: "12/05/2026", status: "P", note: "" },
      { id: 5, date: "11/05/2026", status: "P", note: "" },
      { id: 6, date: "08/05/2026", status: "P", note: "" },
      { id: 7, date: "07/05/2026", status: "F", note: "Gripe" },
      { id: 8, date: "06/05/2026", status: "P", note: "" },
      { id: 9, date: "05/05/2026", status: "P", note: "" },
      { id: 10, date: "04/05/2026", status: "P", note: "" },
    ]
  };

  const totalClasses = studentData.history.length;
  const totalPresent = studentData.history.filter(h => h.status === "P").length;
  const totalAbsent = studentData.history.filter(h => h.status === "F").length;
  const attendancePercentage = Math.round((totalPresent / totalClasses) * 100) || 0;

  // LÓGICA DO CALENDÁRIO
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  
  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); 

  // LÓGICA DOS FILTROS E DA LISTA
  const convertToBRDate = (isoDate) => {
    if (!isoDate) return "";
    const [y, m, d] = isoDate.split("-");
    return `${d}/${m}/${y}`;
  };

  const searchDateBR = convertToBRDate(filterDate);
  
  const filteredHistory = studentData.history.filter(record => {
    const matchStatus = filterStatus === "" || filterStatus === "Todos" || record.status === filterStatus;
    const matchDate = searchDateBR === "" || record.date === searchDateBR;
    return matchStatus && matchDate;
  });

  const clearFilters = () => {
    setFilterDate("");
    setFilterStatus("");
  };

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.mainContent}>
        
        <header className={styles.pageHeader}>
          <div className={styles.titleArea}>
            <h1>Consultar Frequência</h1>
            <p className={styles.studentInfo}>
              {studentData.name} • {studentData.turma} ({studentData.periodo})
            </p>
          </div>
          <button className={styles.backButton} onClick={handleGoBack}>
            ← Voltar para Painel do {roleLabels[originRole] || 'Sistema'}
          </button>
        </header>

        <section className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <h3>Frequência</h3>
            <div className={`${styles.highlightValue} ${attendancePercentage >= 75 ? styles.good : styles.bad}`}>
              {attendancePercentage}%
            </div>
          </div>
          <div className={styles.summaryCard}>
            <h3>Presenças</h3>
            <div className={styles.valuePresent}>{totalPresent}</div>
          </div>
          <div className={styles.summaryCard}>
            <h3>Faltas</h3>
            <div className={styles.valueAbsent}>{totalAbsent}</div>
          </div>
        </section>

        {/* CALENDÁRIO DINÂMICO COM SETAS */}
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
              
              const record = studentData.history.find(h => h.date === dateStr);
              
              let dayClass = styles.calendarDay;
              if (record) {
                dayClass += record.status === 'P' ? ` ${styles.dayPresent}` : ` ${styles.dayAbsent}`;
              }

              return <div key={i} className={dayClass}>{i + 1}</div>;
            })}
          </div>
        </section>

        
        <section className={styles.historySection}>
          
          <div className={styles.filtersBar}>
            <h2>Lançamentos Detalhados</h2>
            
            <div className={styles.filterGroup}>
              <div className={styles.inputBox}>
                <label>Filtrar Dia</label>
                <input 
                  type="date" 
                  value={filterDate} 
                  onChange={(e) => setFilterDate(e.target.value)} 
                />
              </div>

              <div className={styles.inputBox}>
                <label>Status</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>                  
                  <option value="" disabled>Selecione um status...</option>
                  <option value="Todos">Todos os Status</option>
                  <option value="P">Apenas Presenças</option>
                  <option value="F">Apenas Faltas</option>
                </select>
              </div>
              
              {(filterDate !== "" || filterStatus !== "") && (
                <button className={styles.btnClear} onClick={clearFilters}>Limpar Filtros</button>
              )}
            </div>
          </div>
          
          {(filterStatus !== "" || filterDate !== "") && (
            <div className={styles.historyList}>
              <div className={styles.listHeader}>
                <span>Data</span>
                <span>Status</span>
                <span className={styles.hideMobile}>Observação</span>
              </div>

              {filteredHistory.length === 0 ? (
                <div className={styles.emptyState}>Nenhum registro encontrado para este filtro.</div>
              ) : (
                filteredHistory.map((record) => (
                  <div key={record.id} className={styles.historyItem}>
                    <div className={styles.dateBlock}>
                      <span className={styles.dateText}>{record.date}</span>
                    </div>
                    <div className={styles.statusBlock}>
                      <span className={`${styles.statusBadge} ${record.status === 'P' ? styles.badgeP : styles.badgeF}`}>
                        {record.status === 'P' ? 'Presente' : 'Falta'}
                      </span>
                    </div>
                    <div className={`${styles.noteBlock} ${styles.hideMobile}`}>
                      {record.note || "-"}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};