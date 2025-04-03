import styles from "./style.module.scss";
import { useState } from "react";
import DocumentForm from "../../components/DocumentForm/DocumentForm";
import DocumentList from "../../components/DocumentList/DocumentList";

export const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);

  const handleAddDocument = (newDocument) => {
    setDocuments([...documents, newDocument]);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Cadastrar Documento</h2>
      <DocumentForm onAddDocument={handleAddDocument} />

      <h3 className={styles.subTitle}>Documentos</h3>
      <DocumentList documents={documents} setDocuments={setDocuments} />
    </div>
  );
};
