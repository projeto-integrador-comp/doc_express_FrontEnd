import styles from "./style.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
// Se usar react-icons, pode importar ícones aqui. Ex:
// import { FiCheck, FiX, FiAlertCircle } from "react-icons/fi";

export const AttendanceRegisterPage = () => {
  const navigate = useNavigate();

  // Dados mockados simulando a turma do dia (Isso virá do seu backend/contexto depois)
  const [students, setStudents] = useState([
    { id: 1, name: "Elisa Oliveira", status: null, note: "" },
    { id: 2, name: "Gustavo Santos", status: null, note: "" },
    { id: 3, name: "Ana Beatriz Rocha", status: null, note: "" },
    { id: 4, name: "Lucas Ferreira", status: null, note: "" },
  ]);

  // Função para atualizar o status (P = Presente, F = Falta, J = Justificada)
  const handleStatusChange = (id, newStatus) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, status: newStatus } : student
    ));
  };

  // Função para salvar a chamada
  const handleSaveAttendance = () => {
    const pendentes = students.filter(s => s.status === null);
    if (pendentes.length > 0) {
      alert(`Ainda há ${pendentes.length} aluno(s) sem marcação.`);
      return;
    }
    console.log("Dados salvos:", students);
    alert("Chamada salva com sucesso!");
    navigate("/attendancetracking"); // Volta para o painel
  };

  // Data atual formatada para exibição
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.mainContent}>
        {/* CABEÇALHO DA PÁGINA */}
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
          <div className={styles.classInfo}>
            <span className={styles.tag}>Turma: Berçário II</span>
            <span className={styles.tag}>Período: Matutino</span>
          </div>
        </header>

        {/* LISTA DE ALUNOS */}
        <section className={styles.attendanceList}>
          <div className={styles.listHeader}>
            <span>Aluno</span>
            <span className={styles.actionsLabel}>Lançamento</span>
          </div>

          <div className={styles.listBody}>
            {students.map((student) => (
              <div key={student.id} className={styles.studentCard}>
                
                <div className={styles.studentInfo}>
                  <div className={styles.avatar}>{student.name.charAt(0)}</div>
                  <span className={styles.studentName}>{student.name}</span>
                </div>

                <div className={styles.actionGroup}>
                  {/* Botão Presença */}
                  <button 
                    className={`${styles.btnStatus} ${styles.btnPresent} ${student.status === 'P' ? styles.activeP : ''}`}
                    onClick={() => handleStatusChange(student.id, 'P')}
                  >
                    Presente
                  </button>

                  {/* Botão Falta */}
                  <button 
                    className={`${styles.btnStatus} ${styles.btnAbsent} ${student.status === 'F' ? styles.activeF : ''}`}
                    onClick={() => handleStatusChange(student.id, 'F')}
                  >
                    Falta
                  </button>

                  {/* Botão Justificada */}
                  <button 
                    className={`${styles.btnStatus} ${styles.btnJustified} ${student.status === 'J' ? styles.activeJ : ''}`}
                    onClick={() => handleStatusChange(student.id, 'J')}
                  >
                    Justificada
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RODAPÉ COM AÇÃO SALVAR */}
        <footer className={styles.pageFooter}>
          <div className={styles.summary}>
            Total: {students.length} | 
            Presentes: {students.filter(s => s.status === 'P').length} | 
            Faltas: {students.filter(s => s.status === 'F').length}
          </div>
          <button className={styles.btnSave} onClick={handleSaveAttendance}>
            Salvar Chamada
          </button>
        </footer>

      </main>
    </div>
  );
};