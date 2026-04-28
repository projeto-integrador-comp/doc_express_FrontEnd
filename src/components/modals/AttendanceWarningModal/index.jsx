import styles from "./style.module.scss";

export const WarningModal = ({ isOpen, onClose, pendingCount }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.warningIcon}>⚠️</div>
        <h3>Atenção</h3>
        <p>Ainda há <strong>{pendingCount}</strong> aluno(s) sem marcação nesta lista.</p>
        <button className={styles.btnWarning} onClick={onClose}>
          Entendi, vou preencher
        </button>
      </div>
    </div>
  );
};