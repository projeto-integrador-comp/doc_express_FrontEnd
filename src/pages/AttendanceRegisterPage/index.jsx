import styles from "./style.module.scss";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import Header from "../../components/Header/Header";
import { WarningModal } from "../../components/modals/AttendanceWarningModal";
import { SuccessModal } from "../../components/modals/AttendanceSuccessModal";
import { AttendanceRegisterObservationModal } from "../../components/modals/AttendanceRegisterObservationModal";

export const AttendanceRegisterPage = () => {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [activeObsStudentId, setActiveObsStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("Todas");
  const [filterPeriod, setFilterPeriod] = useState("Todos");
  
  const [students, setStudents] = useState([]);

  const getLocalDateString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("@tokenDocExpress");
      const todayDate = getLocalDateString();

      const responseStudents = await api.get("/students", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const alunos = responseStudents.data;

      const presencesPromises = alunos.map(async (aluno) => {
        try {
          const res = await api.get(`/attendance/student/${aluno.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          return Array.isArray(res.data) ? res.data : (res.data?.data || [res.data]);
        } catch (err) { return []; }
      });

      const todasPresencasArrays = await Promise.all(presencesPromises);
      const todasPresencas = todasPresencasArrays.flat(); 

      const formattedStudents = alunos.map(s => {
        const record = todasPresencas.find(a => {
          const idDoBanco = a.studentId || a.student_id || a.student?.id || a.student;
          // Compara apenas a parte da DATA (YYYY-MM-DD)
          const dataNoBanco = String(a.date || a.checkIn || "").split('T')[0];
          return idDoBanco === s.id && dataNoBanco === todayDate;
        });

        return {
          id: s.id,
          name: s.name,
          turma: s.classroom?.name || "Sem Turma",
          periodo: "Matutino",
          status: record?.status || (record?.checkIn ? 'P' : (record ? 'F' : null)),
          attendanceId: record?.id || null, 
          alreadyCheckedOut: !!record?.checkOut, 
          entryTime: record?.checkIn ? record.checkIn.substring(11, 16) : "",
          exitTime: record?.checkOut ? record.checkOut.substring(11, 16) : "",
          isEditingEntry: false,
          obs: record?.observation || ""
        };
      });

      setStudents(formattedStudents);
    } catch (error) {
      toast.error("Erro ao sincronizar dados com o servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
const handleSaveAttendance = async () => {
    const pendentes = filteredStudents.filter(s => s.status === null);
    if (pendentes.length > 0) {
      setPendingCount(pendentes.length); 
      setIsWarningOpen(true); 
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("@tokenDocExpress");
      const todayDate = getLocalDateString();

      const promises = students.map(student => {  
        if (student.alreadyCheckedOut && !student.exitTime) return null;  
        if (student.status === 'P' || student.status === 'F') {          
        if (student.attendanceId && student.status === 'P' && student.exitTime) {          
          const [hours, minutes] = student.exitTime.split(":");
          const exitDate = new Date();
          exitDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);          
          const offset = exitDate.getTimezoneOffset();
          const adjustedExitDate = new Date(exitDate.getTime() - (offset * 60 * 1000));

          const checkoutPayload = {
            studentId: student.id,
            date: todayDate,
            checkOut: adjustedExitDate.toISOString(),
          };

          return api.post("/attendance/check-out", checkoutPayload, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
          
          const payload = {
            studentId: student.id,
            date: todayDate,
            status: student.status,
            observation: student.obs || ""
          };

          if (student.status === 'P') {
            const [hours, minutes] = (student.entryTime || "00:00").split(":");
            const dateForCheckIn = new Date();
            dateForCheckIn.setHours(parseInt(hours), parseInt(minutes), 0, 0);           
            const offset = dateForCheckIn.getTimezoneOffset();
            const adjustedDate = new Date(dateForCheckIn.getTime() - (offset * 60 * 1000));
            payload.checkIn = adjustedDate.toISOString();
          } 
          
          return api.post("/attendance/check-in", payload, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        
        return null;
      }).filter(p => p !== null);

      if (promises.length > 0) {
        await Promise.all(promises);
        setIsSuccessOpen(true);
        fetchData(); 
      }
    } catch (error) {
      console.error("Erro detalhado:", error.response?.data || error.message);
      toast.error("Erro ao salvar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setStudents(students.map(student => {
      if (student.id === id) {
        let updatedStudent = { ...student, status: newStatus };
        if (newStatus === 'P') {
          const now = new Date();
          updatedStudent.entryTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          updatedStudent.exitTime = ""; 
        } else {
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
  setStudents(students.map(student => {
    if (student.id === id) {
      let updated = { ...student, [field]: value };
      
      if (field === 'entryTime' && updated.exitTime && updated.exitTime < value) {
        updated.exitTime = "";
      }      
      
      if (field === 'exitTime' && value < updated.entryTime) {
        toast.warning("A saída não pode ser antes da entrada!");
        return student;
      }

      return updated;
    }
    return student;
    }));
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
  
  const todayDisplay = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const activeStudentForModal = students.find(s => s.id === activeObsStudentId);

  return (
    <div className={styles.container}>
      <Header />      
      <WarningModal isOpen={isWarningOpen} onClose={() => setIsWarningOpen(false)} pendingCount={pendingCount} />
      <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />      
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
            <p className={styles.dateText}>{todayDisplay}</p>
          </div>          
        </header>
        
        {loading && <p>Carregando dados...</p>}

        <section className={styles.filterSection}>
          <div className={styles.searchBox}>
            <label>Buscar Aluno</label>
            <input type="text" placeholder="Digite o nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className={styles.selectBox}>
            <label>Turma</label>
            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
              <option value="Todas">Todas as Turmas</option>
              {[...new Set(students.map(s => s.turma))].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
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
        
        <section className={styles.attendanceList}>
          <div className={styles.listHeader}>
            <span>Aluno</span>
            <span className={styles.actionsLabel}>Lançamento</span>
          </div>

          <div className={styles.listBody}>
            {filteredStudents.length === 0 ? (
              <div className={styles.emptyState}>Nenhum aluno encontrado.</div>
            ) : (
              filteredStudents.map((student) => (
                <div key={student.id} className={styles.studentCard} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', flex: '1 1 auto' }}>
                    <div className={styles.studentInfo} style={{ minWidth: '200px' }}>
                      <div className={styles.avatar}>{student.name.charAt(0)}</div>
                      <div className={styles.nameAndDetails}>
                        <span className={styles.studentName}>{student.name}</span>
                        <span className={styles.studentClass}>{student.turma} - {student.periodo}</span>
                      </div>
                    </div>
                    
                    {student.status === 'P' && (
                      <div className={styles.timeControls} style={{ display: 'flex', gap: '10px', backgroundColor: '#f8fafc', padding: '5px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
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
                              <button onClick={() => toggleEditEntry(student.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}>✏️</button>
                            </>
                          )}
                        </div>
                        <div style={{ width: '1px', backgroundColor: '#cbd5e1' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
                          <label style={{ fontWeight: 'bold', color: '#64748b' }}>Saída:</label>
                          <input
                            type="time"
                            value={student.exitTime}
                            min={student.entryTime}
                            onChange={(e) => handleTimeChange(student.id, 'exitTime', e.target.value)}
                            style={{ padding: '2px', borderRadius: '4px', border: '1px solid #cbd5e1', width: '90px' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: '15px' }}>
                    <div className={styles.actionGroup}>
                      <button 
                        className={`${styles.btnStatus} ${styles.btnPresent} ${student.status === 'P' ? styles.activeP : ''}`}
                        onClick={() => handleStatusChange(student.id, 'P')}
                      >Presente</button>
                      <button 
                        className={`${styles.btnStatus} ${styles.btnAbsent} ${student.status === 'F' ? styles.activeF : ''}`}
                        onClick={() => handleStatusChange(student.id, 'F')}
                      >Falta</button>
                    </div>
                    <button 
                      onClick={() => setActiveObsStudentId(student.id)}
                      className={`${styles.btnObs} ${student.obs ? styles.hasObs : ''}`}
                    >
                      {student.obs ? <><span>📝</span>Info</> : <><span>➕</span>Info</>}
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
            {loading ? "Processando..." : "Salvar Chamada"}
          </button>
        </footer>
      </main>
    </div>
  );
};