import styles from "./DocumentList.module.scss";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const DocumentList = ({ documents, setDocuments }) => {
  const handleCheckboxChange = (index) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc, i) =>
        i === index ? { ...doc, checked: !doc.checked } : doc
      )
    );
  };

  const handleDelete = (index) => {
    setDocuments((prevDocuments) =>
      prevDocuments.filter((_, i) => i !== index)
    );
  };

  return (
    <div className={styles.listContainer}>
      <div className={styles.header}>
        <span className={styles.documentNameHeader}>Nome</span>
        <span className={styles.documentHeader}>Data</span>
        <span className={styles.documentHeader}>Excluir</span>
      </div>

      {documents.map((doc, index) => (
        <div
          key={index}
          className={`${styles.document} ${
            doc.checked ? styles.completed : ""
          }`}
        >
          <input
            type="checkbox"
            checked={doc.checked || false}
            onChange={() => handleCheckboxChange(index)}
            className={styles.checkbox}
          />
          <span className={styles.documentName}>
            {/* Bolinha verde */}
            {doc.checked && <span className={styles.statusDot} />}
            {doc.name}
          </span>
          <span className={styles.documentItem}>
            {formatDate(doc.date)}
          </span>
          <button
            className={styles.deleteButton}
            onClick={() => handleDelete(index)}
          >
            🗑
          </button>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
