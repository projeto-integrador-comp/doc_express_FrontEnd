import { useContext, useState } from "react";
import styles from "./style.module.scss";
import { DocumentContext } from "../../../providers/DocumentContext";

export const DeleteDocumentModal = () => {
  const [loading, setLoading] = useState(false);

  const { deletingDocument, setdeletingDocument, documentDelete } =
    useContext(DocumentContext);
  return (
    <div role="dialog" className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Deseja realmente excluir "{deletingDocument.documentName}"?</h3>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => documentDelete(setLoading, deletingDocument.id)}
            className={styles.closeButton}
          >
            {loading ? "Excluindo..." : "Sim, excluir"}
          </button>
          <button
            onClick={() => setdeletingDocument(null)}
            className={styles.openButton}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
