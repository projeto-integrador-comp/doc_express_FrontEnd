import styles from "./style.module.scss";
import { FaEdit, FaTrash } from "react-icons/fa"; // Certifique-se de ter react-icons instalado

export const ManagementList = ({ title, items, onEdit, onDelete, type }) => {
  return (
    <div className={styles.listContainer}>
      <h3 className="title three">{title}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            {type === "user" ? <th>Cargo</th> : <th>Turma</th>}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{type === "user" ? item.role : item.classroom?.name || "Sem turma"}</td>
                <td className={styles.actions}>
                  <button onClick={() => onEdit(item)} title="Editar">
                    <FaEdit size={18} />
                  </button>
                  <button onClick={() => onDelete(item.id)} title="Excluir">
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="textCenter">Nenhum registro encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};