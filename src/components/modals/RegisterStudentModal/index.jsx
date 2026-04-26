import { useContext } from "react";
import { StudentContext } from "../../../providers/StudentContext";
import { RegisterStudentForm } from "../../forms/RegisterStudentForm"; // Reaproveitamos seu form
import styles from "./style.module.scss"; // Use o mesmo do Update

export const RegisterStudentModal = ({ isOpen, setIsOpen }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <header className={styles.header}>
          <h2 className="title three">Cadastrar Aluno</h2>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>X</button>
        </header>

        {/* Passamos o setIsOpen(false) através da prop onSuccess */}
        <RegisterStudentForm onSuccess={() => setIsOpen(false)} />

        <button className={styles.cancelBtn} onClick={() => setIsOpen(false)}>
          CANCELAR
        </button>
      </div>
    </div>
  );
};