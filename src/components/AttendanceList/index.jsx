import styles from "./style.module.scss";
import { useContext } from "react";
import { AttendanceContext } from "../../providers/AttendanceContext/index.jsx";
import { Eye, Edit, Trash2 } from "lucide-react"; // npm install lucide-react

export const AttendanceList = ({ documents = []}) => {
  const { setEditingAttendance, setViewingAttendance } = useContext(AttendanceContext);

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
            <th>Assiduidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((student) => (
            <tr key={student.id}>
              <td>{student.studentName}</td>
              <td>{student.class}</td>
              <td>
                <span className={student.frequencyRate < 75 ? styles.low : styles.normal}>
                  {student.frequencyRate}%
                </span>
              </td>
              <td className={styles.actions}>
                <button onClick={() => setViewingAttendance(student)} title="Visualizar">
                  <Eye size={18} />
                </button>
                <button onClick={() => setEditingAttendance(student)} title="Editar">
                  <Edit size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};