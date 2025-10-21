import { useContext, useState } from "react";
import styles from "./style.module.scss";
import { UserContext } from "../../../providers/UserContext";
import { DocumentContext } from "../../../providers/DocumentContext";
import { ModelContext } from "../../../providers/ModelContext";
import { toast } from "react-toastify";

const DownloadIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 15L12 3M12 15L15 12M12 15L9 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ModelDetailsModal = () => {
  const { viewingModel, setViewingModel } = useContext(ModelContext);
  const [downloading, setDownloading] = useState(false);

  // Se não há documento selecionado para visualização, o modal não renderiza nada.
  if (!viewingModel) {
    return null;
  }

  const handleClose = () => {
    setViewingModel(null);
  };

  // const handleDownload = async () => {
  //   if (downloading) return;

  //   setDownloading(true);

  //   try {
  //     // Use sua API local como proxy para o download
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/templates/${viewingModel.id}/download`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("@tokenDocExpress")}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`Erro ${response.status}`);
  //     }

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = viewingModel.fileName;
  //     document.body.appendChild(link);
  //     link.click();

  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(link);

  //     toast.success("Download realizado com sucesso!");
  //   } catch (error) {
  //     console.error("Erro no download:", error);
  //     toast.error("Erro ao baixar o arquivo");

  //     // Fallback: tenta abrir diretamente (pode não funcionar por CORS)
  //     window.open(viewingModel.fileUrl, "_blank");
  //   } finally {
  //     setDownloading(false);
  //   }
  // };

  const handleDownload = async () => {
    if (!viewingModel?.fileUrl) return;

    try {
      const response = await fetch(viewingModel.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = viewingModel.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download realizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao baixar o arquivo");
    }
  };

  // Formatando a data para melhor exibição
  const formattedDate = new Date(viewingModel.createdAt).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  return (
    <div role="dialog" aria-modal="true" className={styles.modalOverlay}>
      <div className={styles.modalContent} aria-labelledby="modal-title">
        <header className={styles.modalHeader}>
          <h2 id="modal-title">Detalhes do Modelo</h2>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Fechar modal"
          >
            &times;
          </button>
        </header>

        <main className={styles.modalBody}>
          <dl className={styles.detailsList}>
            <dt>Nome do Modelo:</dt>
            <dd>{viewingModel.name}</dd>

            <dt>Descrição:</dt>
            <dd>{viewingModel.description}</dd>

            <dt>Data de Criação:</dt>
            <dd>{formattedDate}</dd>

            {/* Adicionei informações extras do modelo */}
            <dt>Arquivo:</dt>
            <dd>{viewingModel.fileName}</dd>

            <dt>Tamanho:</dt>
            <dd>{(viewingModel.fileSize / 1024).toFixed(2)} KB</dd>

            {/* <dt>Status:</dt>
            <dd className={viewingDocument.delivered ? styles.statusDelivered : styles.statusPending}>
              {viewingDocument.delivered ? "Entregue" : "Pendente"}
            </dd> */}
          </dl>
        </main>

        <footer className={styles.modalFooter}>
          <button
            onClick={handleDownload}
            className={styles.downloadButton}
            disabled={downloading}
          >
            <DownloadIcon />
            <span>{downloading ? "Baixando..." : "Download"}</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
