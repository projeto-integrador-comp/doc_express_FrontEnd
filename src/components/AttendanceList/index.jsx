import styles from "./style.module.scss";
import { useContext } from "react";
import { AttendanceContext } from "../../providers/AttendanceContext/index.jsx";
import { Eye } from "lucide-react"; 

export const AttendanceList = ({ documents = []}) => {
  const { setViewingAttendance } = useContext(AttendanceContext);

  if (documents.length === 0) {
    return <p className={styles.empty}>Nenhum registro de frequência encontrado.</p>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Turma</th>
            <th className={styles.center}>Assiduidade</th>
            <th className={styles.center}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((student) => (
            <tr key={student.id}>
              <td>{student.studentName}</td>
              <td>{student.class}</td>
              {/* ADICIONADO: styles.center aqui para alinhar o corpo */}
              <td className={styles.center}>
                <span className={student.frequencyRate < 75 ? styles.low : styles.normal}>
                  {student.frequencyRate}%
                </span>
              </td>
              <td className={styles.actions}>
                <button onClick={() => setViewingAttendance(student)} title="Visualizar">
                  <Eye size={18} />
                </button>                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};