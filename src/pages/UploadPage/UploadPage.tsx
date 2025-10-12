import React, { useState, DragEvent, ChangeEvent, FormEvent, ChangeEventHandler } from "react";
import styles from "./style.module.scss";
import Header from "../../components/Header/Header";
import { supabase } from '../../services/supabaseClient';

// dados do formulário
interface FormData {
  documentName: string;
  documentDescription: string;
  file: File | null;
}

// ----------------------------------------------------------------------
// FUNÇÃO DE UTILIDADE: Remove acentos e caracteres especiais do nome do arquivo
// ----------------------------------------------------------------------
const sanitizeString = (str: string) => {
    return str
        .normalize("NFD") // decompõe os caracteres (ex: 'ç' vira 'c' + cedilha)
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // remove tudo que não for letra, número, espaço ou hífen
        .trim() // remove espaços do início/fim
        .replace(/\s+/g, '_'); // substitui espaços por underscores
};

const UploadPage: React.FC = () => {
  // armazena o nome do arquivo selecionado e os dados do formulário
  const [formData, setFormData] = useState<FormData>({
    documentName: "",
    documentDescription: "",
    file: null,
  });
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // estado de Carregamento

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

  // ----------------------------------------------------------------------
  // FUNÇÃO PRINCIPAL DE UPLOAD PARA O SUPABASE
  // ----------------------------------------------------------------------
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.file) {
      alert("Por favor, selecione um arquivo para upload.");
      return;
    }
    
    setIsLoading(true); // INICIA O CARREGAMENTO

    const bucketName = 'teste-upload-doc'; // nome do bucket no supabase
    
    try {
      // cria um nome de arquivo seguro e único
      const fileExtension = formData.file.name.split('.').pop();
      const safeDocumentName = sanitizeString(formData.documentName); // arruma o nome pro supabase não quebrar
      const uniqueFileName = `${safeDocumentName}-${Date.now()}.${fileExtension}`;
      const filePath = `uploads/${uniqueFileName}`; 

      // UPLOAD PARA O SUPABASE STORAGE
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, formData.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erro ao enviar para o Storage:', uploadError);
        alert(`Falha no upload do arquivo: ${uploadError.message}`);
        return;
      }

      // pega a URL pública do arquivo
      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(uploadData.path);
      
      // 2. SALVAR DADOS NO BANCO DE DADOS (tabela de documentos)
      const { error: dbError } = await supabase
        .from('teste-upload') // <-- nome da tabela do db
        .insert([
          {
            name: formData.documentName,
            description: formData.documentDescription,
            file_path: uploadData.path,
            public_url: urlData.publicUrl,
            //outros campos necessários
          }
        ]);

      if (dbError) {
        console.error('Erro ao salvar no DB:', dbError);
        alert(`Upload do arquivo OK, mas falha ao salvar registro: ${dbError.message}`);
        // talvez deletar o arquivo do Storage para limpeza?:
        // await supabase.storage.from(bucketName).remove([uploadData.path]);
        return;
      }

      alert(`Sucesso! Documento "${formData.documentName}" enviado e registrado.`);
      // limpa o formulário após o sucesso
      setFormData({ documentName: "", documentDescription: "", file: null });
      setFileName(null);

    } catch (error) {
      console.error('Erro geral no formulário:', error);
      alert('Ocorreu um erro inesperado. Verifique o console.');
    } finally {
      setIsLoading(false); // FINALIZA O CARREGAMENTO
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
          {/* CAMPOS DO FORMULÁRIO */}
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

          {/* ÁREA DE UPLOAD NO FINAL DO FORMULÁRIO */}
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
            disabled={!formData.file || !formData.documentName || isLoading} // desabilitado no loading
          >
            {isLoading ? 'Enviando...' : 'Salvar e Enviar Documento'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;