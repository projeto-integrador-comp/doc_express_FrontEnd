import styles from "./style.module.scss";

export const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.successIcon}>✅</div>
        <h3>Sucesso!</h3>
        <p>Chamada salva com sucesso!</p>
        <button className={styles.btnSuccess} onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>
  );
};