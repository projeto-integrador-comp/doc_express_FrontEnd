import { useContext } from "react";
import { AttendanceContext } from "../../../providers/AttendanceContext/index.jsx";
import styles from "./style.module.scss";

export const UpdateAttendanceModal = () => {
  const { editingAttendance, setEditingAttendance } = useContext(AttendanceContext);

  if (!editingAttendance) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <header>
          <h2>Editar Registro: {editingAttendance.studentName}</h2>
          <button onClick={() => setEditingAttendance(null)}>X</button>
        </header>
        <form onSubmit={(e) => e.preventDefault()}>
            <label>Atualizar Porcentagem:</label>
            <input type="number" defaultValue={editingAttendance.frequencyRate} />
            <button className={styles.confirmButton}>Atualizar</button>
        </form>
      </div>
    </div>
  );
};