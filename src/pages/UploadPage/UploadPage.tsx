import React, { useState, DragEvent, ChangeEvent, FormEvent } from "react";
import styles from "./style.module.scss";
import { div } from "framer-motion/client";
import Header from "../../components/Header/Header";

// dados do formulário
interface FormData {
  documentName: string;
  documentDescription: string;
  file: File | null;
}

const UploadPage: React.FC = () => {
  // armazena o nome do arquivo selecionado e os dados do formulário
  const [formData, setFormData] = useState<FormData>({
    documentName: "",
    documentDescription: "",
    file: null,
  });
  const [fileName, setFileName] = useState<string | null>(null);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // seleção de arquivo
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFileName(selectedFile.name);
      setFormData((prev) => ({
        ...prev,
        file: selectedFile,
      }));
    }
  };

  // arrastar o doc
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      setFileName(droppedFile.name);
      setFormData((prev) => ({
        ...prev,
        file: droppedFile,
      }));
    }
  };

  // permite o arraste aqui
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  //  envio do formulário
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Dados do Formulário para Envio:", formData);

    // envia para o servidor
    if (formData.file) {
      alert(
        `Enviando documento: ${formData.documentName} e arquivo: ${formData.file.name}`
      );
    } else {
      alert("Por favor, selecione um arquivo para upload.");
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.uploadContainer}>
        <h1 className="title">Upload de modelo de arquivo</h1>
        <p className="subtitle">
          Preencha os dados e carregue o arquivo no final.
        </p>

        <form onSubmit={handleSubmit} className="document-form">
          {/* CAMPOS DO FORMULÁRIO */}
          <div className="form-group">
            <label htmlFor="documentName">Nome do Documento:</label>
            <input
              type="text"
              id="documentName"
              name="documentName"
              className="form-input"
              value={formData.documentName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="documentDescription">Descrição</label>
            <input
              id="documentDescription"
              name="documentDescription"
              className="form-input"
              value={formData.documentDescription}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* ÁREA DE UPLOAD NO FINAL DO FORMULÁRIO */}
          <div className="upload-area-container">
            <h3 className="upload-header">Anexar Arquivo</h3>

            <div
              className="drop-area"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                id="file-upload"
                className="file-input"
                onChange={handleFileSelect}
              />
              <label htmlFor="file-upload" className="upload-button">
                Selecionar Arquivo
              </label>
              <p className="hint">ou arraste e solte aqui</p>
            </div>

            {fileName && (
              <p className="file-name">Arquivo selecionado: {fileName}</p>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={!formData.file || !formData.documentName}
          >
            Salvar e Enviar Documento
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
