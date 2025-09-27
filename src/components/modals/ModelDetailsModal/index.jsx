import { useContext, useState } from "react";
import styles from "./style.module.scss";
import { UserContext } from "../../../providers/UserContext";
import { DocumentContext } from "../../../providers/DocumentContext";

const DownloadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15L12 3M12 15L15 12M12 15L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ModelDetailsModal = () => {
  const { viewingDocument, setViewingDocument } = useContext(DocumentContext);

  // Se não há documento selecionado para visualização, o modal não renderiza nada.
  if (!viewingDocument) {
    return null;
  }

  const handleClose = () => {
    setViewingDocument(null);
  };

  const handleDownload = () => {
    // Abre o link do arquivo em uma nova aba, o que força o download ou a visualização.
    window.open(viewingDocument.fileUrl, '_blank');
  };

  // Formatando a data para melhor exibição
  const formattedDate = new Date(viewingDocument.submissionDate).toLocaleDateString("pt-BR", {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <div role="dialog" aria-modal="true" className={styles.modalOverlay}>
      <div className={styles.modalContent} aria-labelledby="modal-title">
        <header className={styles.modalHeader}>
          <h2 id="modal-title">Detalhes do Documento</h2>
          <button onClick={handleClose} className={styles.closeButton} aria-label="Fechar modal">
            &times;
          </button>
        </header>

        <main className={styles.modalBody}>
          <dl className={styles.detailsList}>
            <dt>Título do Modelo:</dt>
            <dd>{viewingDocument.title}</dd>

            <dt>Descrição:</dt>
            <dd>{viewingDocument.description}</dd>

            <dt>Data de Envio:</dt>
            <dd>{formattedDate}</dd>

            {/* <dt>Status:</dt>
            <dd className={viewingDocument.delivered ? styles.statusDelivered : styles.statusPending}>
              {viewingDocument.delivered ? "Entregue" : "Pendente"}
            </dd> */}
          </dl>
        </main>

        <footer className={styles.modalFooter}>
          <button onClick={handleDownload} className={styles.downloadButton}>
            <DownloadIcon />
            <span>Download</span>
          </button>
        </footer>
      </div>
    </div>
  );
};