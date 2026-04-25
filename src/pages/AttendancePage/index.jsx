import styles from "./style.module.scss";
import { useContext, useState } from "react";
import Header from "../../components/Header/Header";
import { AttendanceContext } from "../../providers/AttendanceContext/index.jsx"; 
import { UserContext } from "../../providers/UserContext/index.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { RegisterAttendanceModal } from "../../components/modals/RegisterAttendanceModal/index.jsx";
import { AttendanceList } from "../../components/AttendanceList";
import { UpdateAttendanceModal } from "../../components/modals/UpdateAttendanceModal/index.jsx";
import { AttendanceDetailsModal } from "../../components/modals/AttendanceDetailsModal/index.jsx";
import { UpdateUserModal } from "../../components/modals/UpdateUserModal/index.jsx";

export const AttendancePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const originRole = location.state?.originRole;
  const {
    attendanceList,
    exportToCSV, 
    exportToXLSX,
    exportToPDF,
    hiddenCreateAttendance,
    editingAttendance,
    viewingAttendance,
  } = useContext(AttendanceContext);

  //Função para voltar
  const handleGoBack = () => {
    if (originRole) {
      // Se veio da dashboard, volta pra lá (você pode tratar lá para abrir no perfil certo se quiser)
      navigate('/attendancetracking', { state: { activeProfile: originRole } });
    } else {
      // Fallback genérico caso o usuário acesse a URL diretamente
      navigate(-1); 
    }
  };

  const { hiddenUpdateUser } = useContext(UserContext);
  
  // ESTADOS DOS FILTROS
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchName, setSearchName] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  // LISTA DE TURMAS ÚNICAS (Dinamismo para o PI3)
  const classes = [...new Set(attendanceList.map(item => item.class))];

  // LÓGICA DE FILTRAGEM UNIFICADA
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
      
      {/* Camada de Modais */}
      {!hiddenCreateAttendance && <RegisterAttendanceModal />}
      {editingAttendance && <UpdateAttendanceModal />}
      {viewingAttendance && <AttendanceDetailsModal />}      
      {!hiddenUpdateUser && <UpdateUserModal />}

      <section className={styles.dashboardContent}>

        <div className={styles.pageHeader}>
          <button className={styles.backButton} onClick={handleGoBack}>
            ← Voltar para {originRole ? `Painel do ${originRole}` : 'Página Anterior'}
          </button>
        </div>

        <div className={styles.topControlSection}></div>
        
        <div className={styles.topControlSection}>
          <fieldset className={styles.filterFieldset}>
            <legend>Busca e Filtros Avançados</legend>
            
            <div className={styles.filterLayout}>
              {/* BLOCO 1: NOME, TURMA E PERÍODO */}
              <div className={styles.inputsColumn}>
                <div className={styles.inputGroup}>
                  <label>Nome do Aluno:</label>
                  <input 
                    type="text" 
                    placeholder="Pesquisar por nome..." 
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>

                <div className={styles.rowInputs}>
                  <div className={styles.inputGroup}>
                    <label>Turma:</label>
                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                      <option value="all">Todas</option>
                      {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Período:</label>
                    <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                      <option value="all">Todos</option>
                      <option value="Matutino">Matutino</option>
                      <option value="Vespertino">Vespertino</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BLOCO 2: CARDS DE STATUS */}
              <div className={styles.statusColumn}>
                <label className={styles.statusTitle}>Assiduidade:</label>
                <div className={styles.statusCardsGroup}>
                  {[
                    { id: "all", label: "Todos", sub: "Geral" },
                    { id: "risk", label: "Risco", sub: "<75%" },
                    { id: "warning", label: "Atenção", sub: "75-85%" },
                    { id: "perfect", label: "100%", sub: "Frequência" }
                  ].map((item) => (
                    <label 
                      key={item.id} 
                      className={`${styles.statusCard} ${selectedFilter === item.id ? styles.activeCard : ""}`}
                    >
                      <input 
                        type="radio" 
                        name="att" 
                        value={item.id} 
                        checked={selectedFilter === item.id} 
                        onChange={(e) => setSelectedFilter(e.target.value)} 
                      />
                      <span className={styles.cardLabel}>{item.label}</span>
                      <span className={styles.cardSub}>{item.sub}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>

          {/* BLOCO 3: EXPORTAÇÃO */}
          <fieldset className={styles.exportFieldset}>
            <legend>Relatórios</legend>
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