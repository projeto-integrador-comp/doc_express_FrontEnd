import { useContext } from "react";
import styles from "./style.module.scss";
import { DocumentContext } from "../../../providers/DocumentContext";
import { UpdateDocumentForm } from "../../forms/UpdateDocumentForm";

export const UpdateDocumentModal = () => {
  const { setEditingDocument } = useContext(DocumentContext);

  <div role="dialog" className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <UpdateDocumentForm />
      <button
        className={styles.closeButton}
        onClick={() => setEditingDocument(null)}
      >
        Fechar
      </button>
    </div>
  </div>;
};
