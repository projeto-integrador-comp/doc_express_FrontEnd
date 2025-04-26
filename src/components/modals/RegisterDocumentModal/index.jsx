import { useContext } from "react";
import { RegisterDocumentForm } from "../../forms/RegisterDocumentForm";
import styles from "./style.module.scss";
import { DocumentContext } from "../../../providers/DocumentContext";

export const RegisterDocumentModal = () => {
  const { setHiddenCreateDocument } = useContext(DocumentContext);
  return (
    <div role="dialog" className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <RegisterDocumentForm />
        <button
          className={styles.closeButton}
          onClick={() => setHiddenCreateDocument(true)}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
