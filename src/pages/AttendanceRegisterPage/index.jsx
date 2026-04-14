import styles from "./style.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";

// Importe os componentes de modal (Ajuste o caminho conforme onde você os salvou)
import { WarningModal } from "../../components/modals/AttendanceWarningModal";
import { SuccessModal } from "../../components/modals/AttendanceSuccessModal";

export const AttendanceRegisterPage = () => {
  const navigate = useNavigate();

  // ESTADOS DOS MODAIS
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // 1. ESTADOS DE FILTRO
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("Berçário II");
  const [filterPeriod, setFilterPeriod] = useState("Matutino");

  // Dados mockados
  const [students, setStudents] = useState([
    { id: 1, name: "Elisa Oliveira", status: null, turma: "Berçário II", periodo: "Matutino" },
    { id: 2, name: "Gustavo Santos", status: null, turma: "Berçário II", periodo: "Matutino" },
    { id: 3, name: "Ana Beatriz Rocha", status: null, turma: "Maternal I", periodo: "Matutino" },
    { id: 4, name: "Lucas Ferreira", status: null, turma: "Berçário II", periodo: "Vespertino" },
    { id: 5, name: "Maria Clara", status: null, turma: "Maternal I", periodo: "Vespertino" },
  ]);

  // Função para atualizar o status (P, F, J)
  const handleStatusChange = (id, newStatus) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, status: newStatus } : student
    ));
  };

  // 2. LÓGICA DE FILTRAGEM
  const filteredStudents = students.filter((student) => {
    const matchesName = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "Todas" || student.turma === filterClass;
    const matchesPeriod = filterPeriod === "Todos" || student.periodo === filterPeriod;
    
    return matchesName && matchesClass && matchesPeriod;
  });

  // Função para salvar a chamada (Agora usando os modais)
  const handleSaveAttendance = () => {
    const pendentes = filteredStudents.filter(s => s.status === null);
    
    if (pendentes.length > 0) {
      setPendingCount(pendentes.length); // Guarda a quantidade
      setIsWarningOpen(true);            // Abre o modal de aviso
      return;
    }
    
    console.log("Dados salvos:", students);
    setIsSuccessOpen(true); // Abre o modal de sucesso
  };

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={styles.container}>
      <Header />
      
      {/* RENDERIZANDO OS MODAIS */}
      <WarningModal 
        isOpen={isWarningOpen} 
        onClose={() => setIsWarningOpen(false)} 
        pendingCount={pendingCount} 
      />
      <SuccessModal 
        isOpen={isSuccessOpen} 
        onClose={() => setIsSuccessOpen(false)} 
      />

      <main className={styles.mainContent}>
        
        <header className={styles.pageHeader}>
          <div className={styles.headerInfo}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              ← Voltar
            </button>
            <div>
              <h1>Diário de Classe</h1>
              <p className={styles.dateText}>{today}</p>
            </div>
          </div>
        </header>

        {/* BARRA DE FILTROS */}
        <section className={styles.filterSection}>
          <div className={styles.searchBox}>
            <label>Buscar Aluno</label>
            <input 
              type="text" 
              placeholder="Digite o nome..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.selectBox}>
            <label>Turma</label>
            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
              <option value="Todas">Todas as Turmas</option>
              <option value="Berçário II">Berçário II</option>
              <option value="Maternal I">Maternal I</option>
            </select>
          </div>

          <div className={styles.selectBox}>
            <label>Período</label>
            <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}>
              <option value="Todos">Todos os Períodos</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
            </select>
          </div>
        </section>

        {/* LISTA DE ALUNOS */}
        <section className={styles.attendanceList}>
          <div className={styles.listHeader}>
            <span>Aluno</span>
            <span className={styles.actionsLabel}>Lançamento</span>
          </div>

          <div className={styles.listBody}>
            {filteredStudents.length === 0 ? (
              <div className={styles.emptyState}>Nenhum aluno encontrado com estes filtros.</div>
            ) : (
              filteredStudents.map((student) => (
                <div key={student.id} className={styles.studentCard}>
                  
                  <div className={styles.studentInfo}>
                    <div className={styles.avatar}>{student.name.charAt(0)}</div>
                    <div className={styles.nameAndDetails}>
                      <span className={styles.studentName}>{student.name}</span>
                      <span className={styles.studentClass}>{student.turma} - {student.periodo}</span>
                    </div>
                  </div>

                  <div className={styles.actionGroup}>
                    <button 
                      className={`${styles.btnStatus} ${styles.btnPresent} ${student.status === 'P' ? styles.activeP : ''}`}
                      onClick={() => handleStatusChange(student.id, 'P')}
                    >
                      Presente
                    </button>
                    <button 
                      className={`${styles.btnStatus} ${styles.btnAbsent} ${student.status === 'F' ? styles.activeF : ''}`}
                      onClick={() => handleStatusChange(student.id, 'F')}
                    >
                      Falta
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <footer className={styles.pageFooter}>
          <div className={styles.summary}>
            Mostrando {filteredStudents.length} alunos | 
            Presentes: {filteredStudents.filter(s => s.status === 'P').length} | 
            Faltas: {filteredStudents.filter(s => s.status === 'F').length}
          </div>
          <button className={styles.btnSave} onClick={handleSaveAttendance}>
            Salvar Chamada
          </button>
        </footer>

      </main>
    </div>
  );
};