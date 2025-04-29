import styles from "./style.module.scss";

export const DeleteUserModal = () => {
  return (
    <div role="dialog" className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Deseja realmente excluir sua conta?</h3>
        <p>todos os seus dados serão perdidos</p>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => documentDelete(setLoading, deletingDocument.id)}
            className={styles.closeButton}
          >
            {loading ? "Excluindo..." : "Sim, excluir"}
          </button>
          <button
            onClick={() => console.log("deletar conta")}
            className={styles.openButton}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
