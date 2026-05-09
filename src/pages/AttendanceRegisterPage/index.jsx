import styles from "./style.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { WarningModal } from "../../components/modals/AttendanceWarningModal";
import { SuccessModal } from "../../components/modals/AttendanceSuccessModal";
import { AttendanceRegisterObservationModal } from "../../components/modals/AttendanceRegisterObservationModal";

export const AttendanceRegisterPage = () => {
  const navigate = useNavigate();

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  
  const [activeObsStudentId, setActiveObsStudentId] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("Todas");
  const [filterPeriod, setFilterPeriod] = useState("Todos");
  
  const [students, setStudents] = useState([
    { id: 1, name: "Elisa Oliveira", status: null, turma: "Berçário II", periodo: "Matutino", entryTime: "", exitTime: "", isEditingEntry: false, obs: "" },
    { id: 2, name: "Gustavo Santos", status: null, turma: "Berçário II", periodo: "Matutino", entryTime: "", exitTime: "", isEditingEntry: false, obs: "" },
    { id: 3, name: "Ana Beatriz Rocha", status: null, turma: "Maternal I", periodo: "Matutino", entryTime: "", exitTime: "", isEditingEntry: false, obs: "" },
    { id: 4, name: "Lucas Ferreira", status: null, turma: "Berçário II", periodo: "Vespertino", entryTime: "", exitTime: "", isEditingEntry: false, obs: "" },
    { id: 5, name: "Maria Clara", status: null, turma: "Maternal I", periodo: "Vespertino", entryTime: "", exitTime: "", isEditingEntry: false, obs: "" },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setStudents(students.map(student => {
      if (student.id === id) {
        let updatedStudent = { ...student, status: newStatus };
        
        if (newStatus === 'P' && student.status !== 'P') {
          const now = new Date();
          updatedStudent.entryTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          updatedStudent.exitTime = ""; 
        } 
        else if (newStatus === 'F') {
          updatedStudent.entryTime = "";
          updatedStudent.exitTime = "";
          updatedStudent.isEditingEntry = false;
        }
        
        return updatedStudent;
      }
      return student;
    }));
  };

  const handleTimeChange = (id, field, value) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, [field]: value } : student
    ));
  };

  const handleObsChange = (id, value) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, obs: value } : student
    ));
  };

  const toggleEditEntry = (id) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, isEditingEntry: !student.isEditingEntry } : student
    ));
  };

  const filteredStudents = students.filter((student) => {
    const matchesName = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "Todas" || student.turma === filterClass;
    const matchesPeriod = filterPeriod === "Todos" || student.periodo === filterPeriod;
    
    return matchesName && matchesClass && matchesPeriod;
  });
  
  const handleSaveAttendance = () => {
    const pendentes = filteredStudents.filter(s => s.status === null);
    
    if (pendentes.length > 0) {
      setPendingCount(pendentes.length); 
      setIsWarningOpen(true); 
      return;
    }
    
    console.log("Dados salvos:", students);
    setIsSuccessOpen(true);
  };

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const activeStudentForModal = students.find(s => s.id === activeObsStudentId);

  return (
    <div className={styles.container}>
      <Header />      
      
      <WarningModal isOpen={isWarningOpen} onClose={() => setIsWarningOpen(false)} pendingCount={pendingCount} />
      <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
      
      {/* NOVO MODAL DE OBSERVAÇÃO */}
      <AttendanceRegisterObservationModal 
        isOpen={activeObsStudentId !== null}
        onClose={() => setActiveObsStudentId(null)}
        studentName={activeStudentForModal?.name}
        initialObs={activeStudentForModal?.obs}
        onSave={(newObs) => {
          handleObsChange(activeObsStudentId, newObs);
          setActiveObsStudentId(null);
        }}
      />

      <main className={styles.mainContent}>
        
        <header className={styles.pageHeader}>
          <div className={styles.titleArea}>
            <h1>Diário de Classe</h1>
            <p className={styles.dateText}>{today}</p>
          </div>          
        </header>
        
        <section className={styles.filterSection}>
          <div className={styles.searchBox}>
            <label>Buscar Aluno</label>
            <input type="text" placeholder="Digite o nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                <div key={student.id} className={styles.studentCard} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>
                  
                  {/* ========================================== */}
                  {/* BLOCO DA ESQUERDA: Aluno + Horários        */}
                  {/* ========================================== */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', flex: '1 1 auto' }}>
                    
                    {/* INFORMAÇÕES DO ALUNO */}
                    <div className={styles.studentInfo} style={{ minWidth: '200px' }}>
                      <div className={styles.avatar}>{student.name.charAt(0)}</div>
                      <div className={styles.nameAndDetails}>
                        <span className={styles.studentName}>{student.name}</span>
                        <span className={styles.studentClass}>{student.turma} - {student.periodo}</span>
                      </div>
                    </div>

                    {/* CONTROLES DE HORÁRIO (Agora fixos na ESQUERDA, logo após o nome) */}
                    {student.status === 'P' && (
                      <div className={styles.timeControls} style={{ display: 'flex', gap: '10px', backgroundColor: '#f8fafc', padding: '5px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        
                        {/* HORA DE ENTRADA */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 'bold', color: '#64748b' }}>Ent:</span>
                          {student.isEditingEntry ? (
                            <input
                              type="time"
                              value={student.entryTime}
                              onChange={(e) => handleTimeChange(student.id, 'entryTime', e.target.value)}
                              onBlur={() => toggleEditEntry(student.id)} 
                              autoFocus
                              style={{ padding: '2px', borderRadius: '4px', border: '1px solid #cbd5e1', width: '90px' }}
                            />
                          ) : (
                            <>
                              <span style={{ color: '#0f172a', fontWeight: '500' }}>{student.entryTime}</span>
                              <button 
                                onClick={() => toggleEditEntry(student.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
                                title="Editar Entrada"
                              >
                                ✏️
                              </button>
                            </>
                          )}
                        </div>

                        <div style={{ width: '1px', backgroundColor: '#cbd5e1' }}></div> {/* Divisória */}

                        {/* HORA DE SAÍDA */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
                          <label style={{ fontWeight: 'bold', color: '#64748b' }}>Saída:</label>
                          <input
                            type="time"
                            value={student.exitTime}
                            onChange={(e) => handleTimeChange(student.id, 'exitTime', e.target.value)}
                            style={{ padding: '2px', borderRadius: '4px', border: '1px solid #cbd5e1', width: '90px' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>


                  {/* ========================================== */}
                  {/* BLOCO DA DIREITA: Botões de Ação + Obs     */}
                  {/* ========================================== */}
                  <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: '15px' }}>
                    
                    {/* BOTÕES DE PRESENÇA/FALTA */}
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

                    {/* ÍCONE DE OBSERVAÇÃO */}
                    <button 
                      onClick={() => setActiveObsStudentId(student.id)}
                      className={`${styles.btnObs} ${student.obs ? styles.hasObs : ''}`}
                      title={student.obs ? "Editar Nota" : "Adicionar Nota"}
                    >
                      {student.obs ? (
                        <><span>📝</span>Info</> 
                      ) : (
                        <><span>➕</span>Info</> 
                      )}
                    </button>

                  </div>

                </div>
              ))
            )}
          </div>
        </section>

        <footer className={styles.pageFooter}>
          <div className={styles.summary}>
            Mostrando: {filteredStudents.length} alunos | 
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