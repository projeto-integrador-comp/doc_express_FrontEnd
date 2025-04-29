import styles from "./style.module.scss";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { DocumentContext } from "../../../providers/DocumentContext";

export const DocumentItem = ({ doc }) => {
  const { setEditingDocument, setdeletingDocument, documentUpdate } =
    useContext(DocumentContext);

  const getStatusDotClass = (doc) => {
    const docDate = new Date(doc.submissionDate);
    docDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const closeToExpiration = new Date();
    closeToExpiration.setDate(today.getDate() + 15);
    closeToExpiration.setHours(0, 0, 0, 0);

    if (docDate >= today && docDate <= closeToExpiration && !doc.delivered) {
      return styles.statusDotYellow;
    } else if (docDate <= today && !doc.delivered) {
      return styles.statusDotRed;
    } else {
      return "";
    }
  };

  const formatDate = (date) => {
    const dateOnly = date.split("T")[0];

    const [year, month, day] = dateOnly.split("-");
    const formatted = `${day}/${month}/${year}`;

    return formatted;
  };
  const [loading, setLoading] = useState(false);
  const deliver = (doc) => {
  

    documentUpdate({ delivered: !doc.delivered }, setLoading, doc.id);
  };

  return (
    <li>
      <motion.div
        className={`${styles.document} ${
          doc.delivered ? styles.completed : ""
        }`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        layout
        transition={{ duration: 0.3 }}
      >
        <div className={styles.actionCell}>
          <button
            type="button"
            className={`${styles.finalizeButton} ${
              doc.delivered ? styles.reopen : ""
            }`}
            onClick={() => deliver(doc)}
          >
            {doc.delivered ? "Entregue" : "Entregar"}
          </button>
        </div>

        <span className={styles.documentName}>
          <span className={`${styles.statusDot} ${getStatusDotClass(doc)}`} />
          {doc.documentName}
        </span>
        <span className={styles.documentItem}>
          {formatDate(doc.submissionDate)}
        </span>

        <button
          className={styles.iconChangeButton}
          onClick={() => setEditingDocument(doc)}
          title="Editar"
        >
          <FaEdit />
        </button>

        <button
          className={styles.iconDeleteButton}
          onClick={() => setdeletingDocument(doc)}
          title="Excluir"
        >
          <FaTrashAlt />
        </button>
      </motion.div>
    </li>
  );
};
