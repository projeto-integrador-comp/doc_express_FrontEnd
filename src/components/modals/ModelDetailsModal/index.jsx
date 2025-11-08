/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import styles from "./style.module.scss";
import { UserContext } from "../../../providers/UserContext";
import { DocumentContext } from "../../../providers/DocumentContext";
import { ModelContext } from "../../../providers/ModelContext";
import { toast } from "react-toastify";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { api } from "../../../services/api";

import { supabase } from "../../../services/supabaseClient";

const DownloadIcon = () => (
  <svg
    width="16"
    height="16"
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

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ModelDetailsModal = () => {
  const {
    viewingModel,
    setViewingModel,
    updateModel,
    deleteModel,
    loadModels,
  } = useContext(ModelContext);

  const [downloading, setDownloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedModel, setEditedModel] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!viewingModel) {
    return null;
  }

  const handleClose = () => {
    setViewingModel(null);
    setIsEditing(false);
    setEditedModel(null);
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedModel({
      name: viewingModel.name,
      description: viewingModel.description,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedModel(null);
  };

  const handleSave = async () => {
    if (!editedModel) return;

    // Validação básica
    if (!editedModel.name.trim()) {
      toast.error("O nome do modelo é obrigatório");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/templates/${viewingModel.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("@tokenDocExpress")}`,
          },
          body: JSON.stringify({
            name: editedModel.name.trim(),
            description: editedModel.description.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }

      const updatedModel = await response.json();

      // ATUALIZA O CONTEXTO - IMPORTANTE!
      if (updateModel) {
        updateModel(viewingModel.id, updatedModel);
      }

      // Recarrega a lista para garantir sincronização
      if (loadModels) {
        await loadModels();
      }

      setIsEditing(false);
      setEditedModel(null);
      toast.success("Modelo atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar modelo:", error);
      toast.error(error.message || "Erro ao atualizar o modelo");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedModel((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDownload = async () => {
    if (!viewingModel?.id) return;

    setDownloading(true);

    try {
      // 1. Tenta baixar direto do Supabase
      const { data, error } = await supabase.storage
        .from("templates") // nome do bucket
        .download(`uploads/${viewingModel.fileName}`);

      if (error || !data) throw new Error("Erro no Supabase");

      // Cria URL e baixa
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = viewingModel.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Download realizado com sucesso (via Supabase)!");
    } catch (supabaseError) {
      console.warn(
        "⚠️ Erro ao baixar do Supabase, tentando backend...",
        supabaseError
      );

      try {
        // 2. Fallback: baixa do backend
        const response = await api.get(
          `/templates/${viewingModel.id}/download`,
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "@tokenDocExpress"
              )}`,
            },
          }
        );

        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = viewingModel.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Download realizado com sucesso (via backend)!");
      } catch (backendError) {
        console.error("❌ Erro ao baixar pelo backend:", backendError);
        toast.error(
          "Erro ao baixar o arquivo. Verifique sua conexão com o servidor."
        );
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/templates/${viewingModel.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@tokenDocExpress")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }

      // ATUALIZA O CONTEXTO - IMPORTANTE!
      if (deleteModel) {
        deleteModel(viewingModel.id);
      }

      // Recarrega a lista para garantir sincronização
      if (loadModels) {
        await loadModels();
      }

      toast.success("Modelo excluído com sucesso!");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Erro ao excluir modelo:", error);
      toast.error(error.message || "Erro ao excluir o modelo");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const formattedDate = new Date(viewingModel.createdAt).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  return (
    <>
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
              <dd>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedModel?.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={styles.editInput}
                    placeholder="Digite o nome do modelo"
                  />
                ) : (
                  viewingModel.name
                )}
              </dd>

              <dt>Descrição:</dt>
              <dd>
                {isEditing ? (
                  <textarea
                    value={editedModel?.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className={styles.editTextarea}
                    rows="3"
                    placeholder="Digite a descrição do modelo"
                  />
                ) : (
                  viewingModel.description || "Sem descrição"
                )}
              </dd>

              <dt>Data de Criação:</dt>
              <dd>{formattedDate}</dd>

              <dt>Arquivo:</dt>
              <dd>{viewingModel.fileName}</dd>

              <dt>Tamanho:</dt>
              <dd>{(viewingModel.fileSize / 1024).toFixed(2)} KB</dd>
            </dl>
          </main>

          <footer className={styles.modalFooter}>
            <div className={styles.footerActions}>
              {!isEditing ? (
                <>
                  <button
                    onClick={handleEdit}
                    className={styles.editButton}
                    aria-label="Editar modelo"
                  >
                    <EditIcon />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className={styles.deleteButton}
                    aria-label="Excluir modelo"
                  >
                    <DeleteIcon />
                    <span>Excluir</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className={styles.downloadButton}
                    disabled={downloading}
                    aria-label={
                      downloading ? "Baixando arquivo..." : "Baixar arquivo"
                    }
                  >
                    <DownloadIcon />
                    <span>{downloading ? "Baixando..." : "Download"}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className={styles.cancelButton}
                    disabled={saving}
                    aria-label="Cancelar edição"
                  >
                    <span>Cancelar</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className={styles.saveButton}
                    disabled={saving || !editedModel?.name?.trim()}
                    aria-label="Salvar alterações"
                  >
                    <span>{saving ? "Salvando..." : "Confirmar"}</span>
                  </button>
                </>
              )}
            </div>
          </footer>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Excluir Modelo"
        message={`Tem certeza que deseja excluir o modelo "${viewingModel.name}"? Esta ação não pode ser desfeita.`}
      />
    </>
  );
};
