import styles from "./DocumentList.module.scss";

const DocumentList = ({ documents, setDocuments }) => {
  // Função para marcar/desmarcar um documento
  const handleCheckboxChange = (index) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc, i) =>
        i === index ? { ...doc, checked: !doc.checked } : doc
      )
    );
  };

  return (
    <div className={styles.listContainer}>
      <div className={styles.header}>
        <span className={styles.documentNameHeader}>Nome</span>
        <span className={styles.documentHeader}>Data</span>
        <span className={styles.documentHeader}>Excluir</span>
      </div>

      {/* Lista de documentos */}
      {documents.map((doc, index) => (
        <div key={index} className={styles.document}>
          <input
            type="checkbox"
            checked={doc.checked || false}
            onChange={() => handleCheckboxChange(index)}
            className={styles.checkbox}
          />
          <span
            className={`${styles.documentName} ${
              doc.checked ? styles.completed : ""
            }`}
          >
            {doc.name}
          </span>
          <span
            className={`${styles.documentItem} ${
              doc.checked ? styles.completed : ""
            }`}
          >
            {doc.date}
          </span>
          {/* <span className={styles.documentName}>{doc.name}</span>
          <span className={styles.documentItem}>{doc.date}</span> */}
          <button className={styles.deleteButton}>🗑</button>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
