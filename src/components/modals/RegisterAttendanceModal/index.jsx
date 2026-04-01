import { useContext } from "react";
import { AttendanceContext } from "../../../providers/AttendanceContext/index.jsx";
import styles from "./style.module.scss";

export const RegisterAttendanceModal = () => {
  const { setHiddenCreateAttendance } = useContext(AttendanceContext);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <header>
          <h2>Registrar Nova Presença</h2>
          <button onClick={() => setHiddenCreateAttendance(true)}>X</button>
        </header>
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Nome do Aluno" />
          <input type="number" placeholder="Frequência (%)" />
          <button type="submit" className={styles.confirmButton}>Salvar Registro</button>
        </form>
      </div>
    </div>
  );
};