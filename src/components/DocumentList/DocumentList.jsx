import styles from "./DocumentList.module.scss";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

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

  const getStatusDotClass = (doc) => {
    if (doc.checked) {
      return styles.statusDotGreen;
    }

    const docDate = new Date(doc.date);
    docDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    sevenDaysFromNow.setHours(0, 0, 0, 0);

    if (docDate >= today && docDate <= sevenDaysFromNow) {
      return styles.statusDotRed;
    }

    return styles.statusDotYellow;
  };

  return (
    <div className={styles.listContainer}>
      <div className={styles.header}>
        <span className={styles.documentNameHeader}>Nome</span>
        <span className={styles.documentHeader}>Data</span>
        <span className={styles.documentHeader}>Editar</span>
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
            {/* {doc.checked && <span className={styles.statusDot} />} */}
            <span className={`${styles.statusDot} ${getStatusDotClass(doc)}`} />
            {doc.name}
          </span>
          <span className={styles.documentItem}>{formatDate(doc.date)}</span>

          <button
            className={styles.iconButton}
            onClick={() => alert("Editar ainda não implementado")}
            title="Editar"
          >
            <FaEdit />
          </button>

          <button
            className={styles.iconButton}
            onClick={() => handleDelete(index)}
            title="Excluir"
          >
            <FaTrashAlt />
          </button>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
