import { useContext } from "react";
import { AttendanceContext } from "../../../providers/AttendanceContext/index.jsx";
import styles from "./style.module.scss";

export const AttendanceDetailsModal = () => {
  const { viewingAttendance, setViewingAttendance } = useContext(AttendanceContext);

  if (!viewingAttendance) return null;

  return (
    <div className={styles.modalOverlay} role="dialog">
      <div className={styles.modalBox}>
        <header>
          <h2>Detalhes da Assiduidade</h2>
          <button onClick={() => setViewingAttendance(null)}>X</button>
        </header>
        <div className={styles.content}>
          <p><strong>Aluno:</strong> {viewingAttendance.studentName}</p>
          <p><strong>Turma:</strong> {viewingAttendance.class}</p>
          <p><strong>Frequência:</strong> {viewingAttendance.frequencyRate}%</p>
          <p><strong>Faltas:</strong> {viewingAttendance.absences}</p>
          <p><strong>Status:</strong> 
            <span className={viewingAttendance.frequencyRate < 75 ? styles.critical : styles.good}>
              {viewingAttendance.status}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};