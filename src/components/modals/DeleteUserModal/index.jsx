import { useContext, useState } from "react";
import styles from "./style.module.scss";
import { UserContext } from "../../../providers/UserContext";

export const DeleteUserModal = () => {
  const { deletingUser, setDeletingUser, userDelete } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  return (
    <div role="dialog" className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Deseja realmente excluir sua conta?</h3>
        <p>todos os seus dados serão perdidos</p>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => userDelete(setLoading, deletingUser.id)}
            className={styles.closeButton}
          >
            {loading ? "Excluindo" : "Sim, excluir"}
          </button>
          <button
            onClick={() => setDeletingUser(null)}
            className={styles.openButton}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
