import styles from "./DocumentList.module.scss";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const formatDate = (date) => {
  const dateOnly = date.split("T")[0];

  const [year, month, day] = dateOnly.split("-");
  const formatted = `${day}/${month}/${year}`;

  return formatted;
};

const DocumentList = ({ documents, setDocuments, onEdit, onDelete }) => {
  const handleCheckboxChange = (docToUpdate) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc === docToUpdate ? { ...doc, checked: !doc.checked } : doc
      )
    );
  };

  const getStatusDotClass = (doc) => {
    const docDate = new Date(doc.submissionDate);
    docDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const proximosDoVencimento = new Date();
    proximosDoVencimento.setDate(today.getDate() + 15);
    proximosDoVencimento.setHours(0, 0, 0, 0);

    if (docDate >= today && docDate <= proximosDoVencimento && !doc.delivered) {
      return styles.statusDotYellow;
    }

    if (docDate <= today && !doc.delivered) {
      return styles.statusDotRed;
    }
  };

  const sortedDocuments = [...documents].sort((a, b) => {
    if (a.delivered !== b.delivered) {
      return a.delivered ? 1 : -1;
    }

    const dateA = new Date(a.submissionDate);
    const dateB = new Date(b.submissionDate);

    return a.delivered ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className={styles.listContainer}>
      <div className={styles.header}>
        <span className={styles.documentActionHeader}>Status</span>
        <span className={styles.documentNameHeader}>Nome</span>
        <span className={styles.documentHeader}>Vencimento</span>
        <span className={styles.documentHeader}>Editar</span>
        <span className={styles.documentHeader}>Excluir</span>
      </div>

      <AnimatePresence>
        {sortedDocuments.map((doc) => (
          <motion.div
            key={doc.id}
            className={`${styles.document} ${
              doc.checked ? styles.completed : ""
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            layout
            transition={{ duration: 0.3 }}
          >
            <div className={styles.actionCell}>
              <button
                className={`${styles.finalizeButton} ${
                  doc.delivered ? styles.reopen : ""
                }`}
                onClick={() => handleCheckboxChange(doc)}
              >
                {doc.delivered ? "Entregue" : "Entregar"}
              </button>
            </div>

            <span className={styles.documentName}>
              <span
                className={`${styles.statusDot} ${getStatusDotClass(doc)}`}
              />
              {doc.documentName}
            </span>
            <span className={styles.documentItem}>
              {formatDate(doc.submissionDate)}
            </span>

            <button
              className={styles.iconChangeButton}
              onClick={() => onEdit(doc)}
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
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default DocumentList;
