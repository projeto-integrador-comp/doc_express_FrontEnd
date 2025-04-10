import styles from "./DocumentList.module.scss";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const DocumentList = ({ documents, setDocuments, onEdit, onDelete }) => {
  const handleCheckboxChange = (index) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc, i) =>
        i === index ? { ...doc, checked: !doc.checked } : doc
      )
    );
  };

  const getStatusDotClass = (doc) => {
    // if (doc.checked) {
    //   return styles.statusDotGreen;
    // }

    const docDate = new Date(doc.date);
    docDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const proximosDoVencimento = new Date();
    proximosDoVencimento.setDate(today.getDate() + 15);
    proximosDoVencimento.setHours(0, 0, 0, 0);

    if (docDate >= today && docDate <= proximosDoVencimento && !doc.checked) {
      return styles.statusDotYellow;
    }

    if (docDate <= today && !doc.checked) {
      return styles.statusDotRed;
    }

    // return styles.statusDotYellow;
  };

  return (
    <div className={styles.listContainer}>
      <div className={styles.header}>
        <span className={styles.documentActionHeader}>Status</span>
        <span className={styles.documentNameHeader}>Nome</span>
        <span className={styles.documentHeader}>Vencimento</span>
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
          <div className={styles.actionCell}>
            <button
              className={`${styles.finalizeButton} ${
                doc.checked ? styles.reopen : ""
              }`}
              onClick={() => handleCheckboxChange(index)}
            >
              {doc.checked ? "Reabrir" : "Finalizar"}
            </button>
          </div>

          <span className={styles.documentName}>
            {/* Bolinha verde */}
            {/* {doc.checked && <span className={styles.statusDot} />} */}
            <span className={`${styles.statusDot} ${getStatusDotClass(doc)}`} />
            {doc.name}
          </span>
          <span className={styles.documentItem}>{formatDate(doc.date)}</span>

          <button
            className={styles.iconChangeButton}
            onClick={() => onEdit(doc)} // aqui estava passando o index
            title="Editar"
          >
            <FaEdit />
          </button>

          <button
            className={styles.iconDeleteButton}
            onClick={() => onDelete(doc)}
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
