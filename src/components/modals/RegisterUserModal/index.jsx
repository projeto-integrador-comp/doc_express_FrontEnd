import { RegisterUserForm } from "../../forms/RegisterUserForm";
import styles from "./style.module.scss"; 

export const RegisterUserModal = ({ isOpen, setIsOpen }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} role="dialog">
      <div className={styles.modalBox}>
        <header className={styles.header}>
          <h2 className="title three">Cadastrar Colaborador</h2>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>X</button>
        </header>

        {/* O formulário de cadastro entra aqui */}
        <RegisterUserForm onSuccess={() => setIsOpen(false)} />

        <button 
          type="button" 
          className={styles.cancelBtn} 
          onClick={() => setIsOpen(false)}
        >
          CANCELAR
        </button>
      </div>
    </div>
  );
};