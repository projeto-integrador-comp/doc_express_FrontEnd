import React, { useState, DragEvent, ChangeEvent, FormEvent } from "react";
import styles from "./style.module.scss";
import Header from "../../components/Header/Header";
import { supabase } from "../../services/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// -------------------------------
// INTERFACE DOS DADOS DO FORMULÁRIO
// -------------------------------
interface FormData {
  documentName: string;
  documentDescription: string;
  file: File | null;
}

// -------------------------------
// PROPS DO COMPONENTE
// -------------------------------
interface UploadPageProps {
  onUploadSuccess?: () => void; // função para atualizar a lista de modelos
}

// -------------------------------
// FUNÇÃO PARA LIMPAR O NOME DO ARQUIVO
// -------------------------------
const sanitizeString = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
};

// -------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------
const UploadPage: React.FC<UploadPageProps> = ({ onUploadSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    documentName: "",
    documentDescription: "",
    file: null,
  });
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const allowedExtensions = ["docx", "xlsx", "pdf"];

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const selectedFile = event.target.files[0];
      const extension = selectedFile.name.split(".").pop()?.toLowerCase();

      if (!extension || !allowedExtensions.includes(extension)) {
        toast.error(
          "Tipo de arquivo inválido. Apenas .docx, .xlsx e .pdf são permitidos."
        );
        event.target.value = "";
        return;
      }

      setFileName(selectedFile.name);
      setFormData({ ...formData, file: selectedFile });
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files?.length) {
      const droppedFile = event.dataTransfer.files[0];
      const extension = droppedFile.name.split(".").pop()?.toLowerCase();

      if (!extension || !allowedExtensions.includes(extension)) {
        toast.error(
          "Tipo de arquivo inválido. Apenas .docx, .xlsx e .pdf são permitidos."
        );
        return;
      }

      setFileName(droppedFile.name);
      setFormData({ ...formData, file: droppedFile });
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // -----------------------------------------------------
  // ENVIO DE ARQUIVO (LOCAL OU SUPABASE)
  // -----------------------------------------------------
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.file) {
      toast.warn("Por favor, selecione um arquivo para upload.");
      return;
    }

    setIsLoading(true);

    try {
      const isLocalhost = window.location.hostname === "localhost";
      const file = formData.file;

      if (isLocalhost) {
        // 🔹 MODO LOCAL: envia via API do backend (Multer + TypeORM)
        const form = new FormData();
        form.append("name", formData.documentName);
        form.append("description", formData.documentDescription);
        form.append("file", file);

        const response = await fetch("http://localhost:3000/templates", {
          method: "POST",
          body: form,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro no upload local: ${errorText}`);
        }

        toast.success("Arquivo salvo localmente com sucesso!");
      } else {
        // 🔹 MODO PRODUÇÃO: envia via SUPABASE
        const bucketName = "templates";
        const fileExtension = file.name.split(".").pop();
        const safeDocumentName = sanitizeString(formData.documentName);
        const uniqueFileName = `${safeDocumentName}-${Date.now()}.${fileExtension}`;
        const filePath = `uploads/${uniqueFileName}`;

        // Upload no storage do Supabase
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        const publicUrl = urlData.publicUrl;

        const now = new Date().toISOString();
        const templateData = {
          name: formData.documentName,
          description: formData.documentDescription,
          fileName: filePath,
          fileSize: file.size,
          mimeType: file.type,
          isActive: true,
          createdAt: now,
          updatedAt: now,
          fileUrl: publicUrl,
        };

        const { error: dbError } = await supabase
          .from("templates")
          .insert([templateData]);

        if (dbError) throw dbError;

        toast.success("Arquivo enviado e salvo no Supabase com sucesso!");
      }

      // limpa o formulário
      setFormData({ documentName: "", documentDescription: "", file: null });
      setFileName(null);

      // Atualiza lista
      if (onUploadSuccess) onUploadSuccess();
    } catch (error: any) {
      console.error("Erro no upload:", error);
      toast.error(error.message || "Erro ao enviar o arquivo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.uploadContainer}>
        <h1 className={styles.title}>Upload de modelo de arquivo</h1>
        <p className={styles.subtitle}>
          Preencha os dados e carregue o arquivo no final.
        </p>

        <form onSubmit={handleSubmit} className={styles.documentForm}>
          <div className={styles.formGroup}>
            <label htmlFor="documentName">Nome do Documento:</label>
            <input
              type="text"
              id="documentName"
              name="documentName"
              className={styles.formInput}
              value={formData.documentName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="documentDescription">Descrição</label>
            <textarea
              id="documentDescription"
              name="documentDescription"
              className={styles.formInput}
              value={formData.documentDescription}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.uploadAreaContainer}>
            <h3 className={styles.uploadHeader}>Anexar Arquivo</h3>
            <div
              className={styles.dropArea}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                id="fileUpload"
                className={styles.fileInput}
                onChange={handleFileSelect}
                accept=".docx,.xlsx,.pdf"
              />
              <label htmlFor="fileUpload" className={styles.uploadButton}>
                Selecionar Arquivo
              </label>
              <p className={styles.hint}>ou arraste e solte aqui</p>
            </div>

            {fileName && (
              <p className={styles.fileName}>Arquivo selecionado: {fileName}</p>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={!formData.file || !formData.documentName || isLoading}
          >
            {isLoading ? "Enviando..." : "Salvar e Enviar Documento"}
          </button>
        </form>
      </div>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UploadPage;
